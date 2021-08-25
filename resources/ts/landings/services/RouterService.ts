import RouteRecognizer, { Result } from 'route-recognizer';
import { Injectable } from '@shared/decorators/Injectable';
import { Log4ts } from '@shared/decorators/Log4ts';
import { LogChannel } from '@shared/lib/log';
import { Controller } from '../classes/Controller';
import { Route } from '../classes/Route';

@Injectable('RouterService')
export class RouterService {
    private registry: Route<any>[] = [];
    private recognizer: RouteRecognizer;

    @Log4ts('RouterService')
    private log!: LogChannel;

    constructor() {
        this.recognizer = new RouteRecognizer();
    }

    addRoute<C extends Controller>(route: Route<C>) {
        this.registry.push(route);
        return route;
    }

    exec(callback: () => void) {
        callback();
        return this.run();
    }

    run() {
        this.log.debug('Run');
        this.registry.forEach((route) => {
            const options = {
                as: route.name(),
            };

            const routes = [
                {
                    path: route.path(),
                    handler: (...args: any[]) => route.handle(...args),
                },
            ];

            this.recognizer.add(routes, options);
        });

        return this.consumeRoute();
    }

    private consumeRoute() {
        const pathName = `${window.location.pathname.replace(/\/$/g, '')}/`;
        const path$ = pathName + window.location.search;
        const result = this.recognizer.recognize(path$);
        const queryParams = result?.queryParams ?? {};
        const results: Result[] = Array.from((result || []) as any);

        results.forEach(({ handler, params }) => {
            if (handler && typeof handler === 'function') {
                handler(params, queryParams);
            }
        });

        return this;
    }
}

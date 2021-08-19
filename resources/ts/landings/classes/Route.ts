import type { ClassConstructor } from 'class-transformer';
import { cleanPath } from '@shared/lib/strings/cleanPath';
import { SelfInvoker } from '../interfaces/SelfInvoker';
import { route, RouteFunc } from '../utils/route';
import { Controller } from './Controller';

export type RouteActionTuple<C extends Controller, K extends keyof C = keyof C> = [
    controller: ClassConstructor<C>,
    key: K,
];

type RouteActionStatic<C extends Controller> = ClassConstructor<C & SelfInvoker> | RouteActionTuple<C>;
type RouteActionPromise<C extends Controller> =
    | (() => Promise<ClassConstructor<C & SelfInvoker>>)
    | (() => Promise<RouteActionTuple<C>>);

export type RouteAction<C extends Controller> = RouteActionStatic<C> | RouteActionPromise<C>;

export class Route<C extends Controller = Controller> {
    private _parent!: Route<any>;
    constructor(private _path: string, private _action?: RouteAction<C>, private _name?: string) {}

    public name<T>(name?: T): T extends string ? this : string {
        if (typeof name !== 'undefined') {
            this._name = `${name ?? ''}`;
            return this as any;
        }

        if (this._parent) {
            return `${this._parent.name()}.${this._name}` as any;
        }

        return `${this._name}` as any;
    }

    public path<T>(path?: T): T extends string ? this : string {
        if (typeof path !== 'undefined') {
            this._path = `${path ?? ''}`;
            return this as any;
        }

        if (this._parent) {
            return `/${cleanPath(this._parent.path() + '/' + this._path)}/` as any;
        }

        return `/${cleanPath(this._path)}/` as any;
    }

    public action<T>(action?: T): T extends RouteAction<C> ? this : RouteAction<C> {
        if (typeof action !== 'undefined') {
            this._action = action as any;
            return this as any;
        }

        return this._action as any;
    }

    public parent<T>(parent?: T): T extends Route<any> ? this : Route<any> {
        if (typeof parent !== 'undefined') {
            this._parent = parent as any;
            return this as any;
        }

        return this._parent as any;
    }

    public group(callback: (route: RouteFunc) => void) {
        callback((path, action) => {
            return route(path, action).parent(this);
        });

        return this;
    }

    async handle(...args: any[]) {
        const action = this._action;
        let controllerAction: RouteActionStatic<any> = action as any;
        if (typeof action === 'function') {
            controllerAction = await (action as RouteActionPromise<any>)();
        }

        const controller = Array.isArray(controllerAction) ? controllerAction[0] : controllerAction;
        const method = Array.isArray(controllerAction) ? controllerAction[1] : 'invoke';

        const instance = new controller();
        instance[method](...args);
    }
}

import type { ClassConstructor } from 'class-transformer';
import { cleanPath } from '@shared/lib/strings/cleanPath';
import { SelfInvoker } from '../interfaces/SelfInvoker';
import { RouteFunc, route } from '../utils/route';
import { Controller } from './Controller';

type ActionModule<C> = ClassConstructor<C> | { default: ClassConstructor<C> };

type RouteActionController<T extends Controller> = ClassConstructor<T> | (() => Promise<ActionModule<T>>);

export type RouteActionTuple<
    C extends Controller,
    K extends keyof Omit<C, keyof Controller> = keyof Omit<C, keyof Controller>,
> = [controller: RouteActionController<C>, key: K];

export type RouteAction<C extends Controller> = RouteActionController<C & SelfInvoker> | RouteActionTuple<C>;

/**
 * Route class used to create Route definitions used to load partial scripts to the desired
 * page route.
 * The route works similarly to Laravel route, the only difference it's that we have implemented
 * in a frontend way, so we don't support middlewares, methods and the other features.
 */
export class Route<C extends Controller = Controller> {
    private _parent!: Route<any>;

    constructor(private _path: string, private _action?: RouteAction<C>, private _name?: string) {}

    /**
     * Name specify name of the route.
     * @param name
     */
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

    /**
     * The path used to match the location path.
     * @param path
     */
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

    /**
     * The action we want to do when the route match.
     * @param action
     */
    public action<T>(action?: T): T extends RouteAction<C> ? this : RouteAction<C> {
        if (typeof action !== 'undefined') {
            this._action = action as any;
            return this as any;
        }

        return this._action as any;
    }

    /**
     * parent route used to define relative routes.
     * @param parent
     */
    public parent<T>(parent?: T): T extends Route<any> ? this : Route<any> {
        if (typeof parent !== 'undefined') {
            this._parent = parent as any;
            return this as any;
        }

        return this._parent as any;
    }

    /**
     * Create a group of the defined route.
     * @param callback
     */
    public group(callback: (route: RouteFunc) => void) {
        callback((path, action) => {
            return route(path, action).parent(this);
        });

        return this;
    }

    /**
     * Route handler, executed when the route match.
     * @param args
     */
    public async handle(...args: any[]) {
        const action = this._action;
        const actionSlice = [action];

        if (!Array.isArray(action)) {
            if (this.isActionCallback(action)) {
                actionSlice[0] = await (action as any)();
            }
        } else {
            actionSlice[0] = action[0] as any;
            actionSlice[1] = action[1] as any;
        }

        if (this.isActionCallback(actionSlice[0])) {
            actionSlice[0] = await (actionSlice[0] as any)();
        }

        const controller: any = (actionSlice[0] as any).default || actionSlice[0];
        const method: any = actionSlice[1] || 'invoke';
        const instance = new controller();

        if (instance.setup) {
            await instance.setup(method, ...args);
        }

        instance[method](...args);
    }

    private isActionCallback(action: any) {
        if (typeof action === 'function') {
            return !(action.prototype instanceof Controller);
        }

        return false;
    }
}

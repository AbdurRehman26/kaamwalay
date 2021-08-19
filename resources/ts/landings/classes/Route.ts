import type { ClassConstructor } from 'class-transformer';
import { cleanPath } from '@shared/lib/strings/cleanPath';
import { SelfInvoker } from '../interfaces/SelfInvoker';
import { route, RouteFunc } from '../utils/route';
import { Controller } from './Controller';

type ActionModule<C> = ClassConstructor<C> | { default: ClassConstructor<C> };

export type RouteActionTuple<C extends Controller, K extends keyof C = keyof C> = [
    controller: ClassConstructor<C> | (() => Promise<ActionModule<C>>),
    key: K,
];

type RouteActionStatic<C extends Controller> = ClassConstructor<C & SelfInvoker> | RouteActionTuple<C>;
type RouteActionPromise<C extends Controller> = () => Promise<ActionModule<C & SelfInvoker>>;

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

        instance[method](...args);
    }

    private isActionCallback(action: any) {
        if (typeof action === 'function') {
            return !(action.prototype instanceof Controller);
        }

        return false;
    }
}

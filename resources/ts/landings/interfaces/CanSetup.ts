import type { Controller, ControllerMethods } from '../classes/Controller';

export interface CanSetup<T extends Controller> {
    setup(method: ControllerMethods<T>, params: Record<string, any>, query: Record<string, any>): void | Promise<void>;
}

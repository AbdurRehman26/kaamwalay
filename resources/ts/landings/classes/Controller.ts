export type ControllerMethods<C extends Controller> = keyof Omit<C, keyof Controller> | string;

interface BeforeOptions<C extends Controller> {
    only?: ControllerMethods<C>[];
    except?: ControllerMethods<C>[];
}

export class Controller {
    private _before!: string;
    private _beforeOptions: BeforeOptions<any> = {};

    /**
     * @deprecated Not Implemented Yet.
     * @param method
     * @param options
     */
    public before<T extends Controller = this>(method: ControllerMethods<T>, options?: BeforeOptions<T>): this {
        this._before = method as string;
        this._beforeOptions = options ?? {};
        return this;
    }
}

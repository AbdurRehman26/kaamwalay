type Resolver<T> = (value?: PromiseLike<T> | T) => void;
type Rejector<T = any> = (reason?: T) => void;

export class Defer<T = any> {
    private readonly __promise: Promise<T>;
    private __resolve: Resolver<T>[] = [];
    private __reject: Rejector[] = [];

    constructor(resolve$?: Resolver<T>, reject$?: Rejector) {
        this.__promise = new Promise<T>((resolve, reject) => {
            if (reject$) {
                this.__reject.push(reject$);
            }
            if (resolve$) {
                this.__resolve.push(resolve$);
            }
            this.__reject.push(reject);
            this.__resolve.push(resolve as any);
        });

        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
    }

    /**
     * Get and use internal promise in a better way
     * @example
     * ```
     * const q = new Defer();
     *
     * const handle = async () {
     *     console.log('Start the task');
     *     await q.wait();
     *     console.log('Done!');
     * };
     *
     * const onClick = () => q.resolve();
     * ```
     */
    public async wait(): Promise<T> {
        return this.__promise;
    }

    /**
     * Resolve promise
     * @param value
     */
    public resolve(value?: T | PromiseLike<T>): void {
        this.__resolve.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(value);
            }
        });
    }

    /**
     * Reject promise
     * @param reason
     */
    public reject(reason?: any): void {
        this.__reject.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(reason);
            }
        });
    }

    public resolveAndWait(value?: T | PromiseLike<T>): Promise<T> {
        this.resolve(value);
        return this.wait();
    }
}

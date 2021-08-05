import { inject } from 'inversify';

import { InjectableMetaOptions, ReflectParamsType } from '@shared/constants/ReflectMetadata';

/**
 * Inject it's a decorator that can be used to inject an already defined Injectable,
 * @example
 * ```typescript
 *
 * @Injectable()
 * class BarService {
 *     public sayHi () {
 *         console.log("Hi there!");
 *     }
 * }
 *
 * @injectable()
 * class Foo () {
 *     constructor (
 *         @Inject() private barService: BarService
 *     ) {}
 *
 *     greeter () {
 *         this.barService.sayHi();
 *     }
 * }
 * ```
 *
 * @param {T} token Used as token to inject a defined Injectable, token can be a string,
 *                  symbol or Injectable class.
 */
export function Inject<T = any>(token?: T) {
    return (target: object, targetKey: string, index?: number) => {
        let symbol: string | symbol | null;

        if (typeof token === 'string' || typeof token === 'symbol') {
            symbol = token;
        } else {
            const token$ = token || Reflect.getMetadata(ReflectParamsType, target, targetKey);
            const options = Reflect.getMetadata(InjectableMetaOptions, token$[index as any] || token$);
            symbol = options?.symbol;
        }

        if (symbol) {
            inject(symbol)(target, targetKey, index);
        }
    };
}

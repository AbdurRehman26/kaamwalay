import { injectable } from 'inversify';
import { InjectableMetaOptions } from '../constants/ReflectMetadata';
import { GetInjectableName } from '../interfaces/GetInjectableName';
import { DependencyContainer } from '../lib/dependencyInjection/container';

interface InjectableOptions {
    symbol?: symbol;
    name?: string;
}

/**
 *
 * @param name
 * @param options
 * @constructor
 */
export function Injectable(name: string | InjectableOptions, options: InjectableOptions = {}): ClassDecorator {
    return (target) => {
        if (name && typeof name === 'object') {
            options = name;
        }

        if (name && typeof name === 'string') {
            options.name = name;
        }

        if (!options.name) {
            const getInjectableName =
                (target as any as GetInjectableName).getInjectableName ||
                (target.prototype as GetInjectableName).getInjectableName;

            const injectableName = getInjectableName ? getInjectableName() : null;
            options.name = injectableName || target.name || target.constructor.name;
        }

        if (!options.symbol) {
            options.symbol = Symbol.for(options.name);
        }

        Reflect.defineMetadata(InjectableMetaOptions, options, target);
        injectable()(target);

        DependencyContainer.bind(options.symbol).to(target as any);
    };
}

import { injectable } from 'inversify';

import { InjectableMetaOptions } from '@shared/constants/ReflectMetadata';
import { GetInjectableName } from '@shared/interfaces/GetInjectableName';
import { DependencyContainer } from '@shared/lib/dependencyInjection/container';

interface InjectableOptions {
    symbol?: symbol;
    name?: string;
}

/**
 *
 * @param options
 * @constructor
 */
export function Injectable(options: InjectableOptions = {}): ClassDecorator {
    return (target) => {
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

        DependencyContainer.bind(options.symbol)
            .to(target as any)
            .inSingletonScope();
    };
}
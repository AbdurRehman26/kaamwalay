import { plainToClass } from 'class-transformer';

import { BindParamsDecoratorOptions, ReflectParamsType } from '@shared/constants/ReflectMetadata';

export function bindParams(args: any[], { target, propertyKey }: Record<string, any>) {
    const paramTypes = Reflect.getMetadata(ReflectParamsType, target, propertyKey);

    return args.map((arg, index) => {
        const type = paramTypes[index];
        if (!type || !arg || typeof arg !== 'object') {
            return arg;
        }

        return plainToClass(type, arg);
    });
}

/**
 * Bind plain objects to the defined type.
 * @constructor
 */
export function BindParams(): MethodDecorator {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>): any => {
        const bindOptions = Reflect.getMetadata(BindParamsDecoratorOptions, target, propertyKey);
        if (bindOptions) {
            return;
        }

        Reflect.defineMetadata(BindParamsDecoratorOptions, {}, target, propertyKey);

        const oldValue = descriptor.value;
        descriptor.value = function (...args: any[]) {
            return oldValue.apply(this, bindParams(args, { target, propertyKey }));
        };
    };
}

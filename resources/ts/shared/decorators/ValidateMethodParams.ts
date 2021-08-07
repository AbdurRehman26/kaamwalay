import { validate, validateSync, ValidatorOptions } from 'class-validator';

import { ReflectReturnType } from '@shared/constants/ReflectMetadata';
import { Exception } from '@shared/exceptions/Exception';
import { ValidationException } from '@shared/exceptions/ValidationException';

import { bindParams } from './BindParams';

export function ValidateMethodParams(options?: ValidatorOptions): MethodDecorator {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>): any => {
        const name = (target as any).name || target.constructor.name;
        const oldValue = descriptor.value;

        descriptor.value = (...args: any[]) => {
            const newArgs = bindParams(args, { target, propertyKey }).map((arg, index) => {
                if (!arg || typeof arg !== 'object') {
                    return arg;
                }

                const errors = validateSync(arg, options);
                if (errors && errors.length > 0) {
                    throw new ValidationException(index, propertyKey, name, errors);
                }

                return arg;
            });

            return oldValue(...newArgs);
        };
    };
}

/**
 * Validating async rules
 * Note: that will force your function to return promise.
 * @param options
 * @constructor
 */
export function ValidateMethodParamsAsync(options?: ValidatorOptions): MethodDecorator {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>): any => {
        const name = (target as any).name || target.constructor.name;
        const oldValue = descriptor.value;

        const returnType = Reflect.getMetadata(ReflectReturnType, target, propertyKey);
        if (!returnType || returnType !== Promise) {
            throw new Exception('Use ValidateMethodParamsAsync only for async methods!');
        }

        descriptor.value = async (...args: any[]) => {
            const newArgs = bindParams(args, { target, propertyKey }).map(async (arg, index) => {
                if (!arg || typeof arg !== 'object') {
                    return arg;
                }

                const errors = await validate(arg, options);
                if (errors && errors.length > 0) {
                    throw new ValidationException(index, propertyKey, name, errors);
                }

                return arg;
            });

            const result = await Promise.all(newArgs);
            return oldValue(...result);
        };
    };
}

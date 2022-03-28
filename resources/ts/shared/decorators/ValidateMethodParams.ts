import { ValidatorOptions, validate, validateSync } from 'class-validator';
import { ReflectReturnType } from '../constants/ReflectMetadata';
import { ValidationException } from '../exceptions/ValidationException';
import { bindParams } from './BindParams';

export function ValidateMethodParams(options?: ValidatorOptions): MethodDecorator {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>): any => {
        const name = (target as any).name || target.constructor.name;
        const oldValue = descriptor.value;

        descriptor.value = function (...args: any[]) {
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

            return oldValue.apply(this, newArgs);
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
            throw new Error('Use ValidateMethodParamsAsync only for async methods!');
        }

        descriptor.value = async function (...args: any[]) {
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
            return oldValue.apply(this, result);
        };
    };
}

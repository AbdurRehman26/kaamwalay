import { Expose, Type } from 'class-transformer';
import { ExposeOptions } from 'class-transformer/types/interfaces';
import { TypeOptions } from 'class-transformer/types/interfaces/decorator-options/type-options.interface';

interface Options extends ExposeOptions {
    type?: boolean | (() => any);
    typeOptions?: TypeOptions;
}
export function Field(name?: string, funcType?: () => any): PropertyDecorator;
export function Field(name?: string, options?: Options): PropertyDecorator;

export function Field(name?: string, options?: Options | (() => any)): PropertyDecorator {
    return (target, propertyName) => {
        if (typeof options === 'function') {
            options = { type: options };
        }

        let { type: funcType, typeOptions, ...optionsRest } = options || {};

        Expose({ ...(optionsRest ?? {}), name })(target, propertyName);

        if (funcType || typeof funcType === 'undefined') {
            if (typeof funcType === 'boolean') {
                funcType = undefined;
            }

            Type(funcType, typeOptions)(target, propertyName);
        }
    };
}

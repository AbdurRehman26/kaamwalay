import { snakeCase } from 'lodash';
import { PropertyNamingOptions, propertyNaming } from './propertyNaming';

export function toApiPropertiesObject(
    object: Record<string, any>,
    options?: PropertyNamingOptions,
): Record<string, any> {
    return propertyNaming(object, {
        ...options,
        keyTransformer: snakeCase,
    });
}

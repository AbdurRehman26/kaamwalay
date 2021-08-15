import { camelCase } from 'lodash';
import { propertyNaming, PropertyNamingOptions } from './propertyNaming';

export function fromApiPropertiesObject(
    object: Record<string, any>,
    options?: PropertyNamingOptions,
): Record<string, any> {
    return propertyNaming(object, {
        ...options,
        keyTransformer: camelCase,
    });
}

import { snakeCase } from 'lodash';

import { propertyNaming, PropertyNamingOptions } from './propertyNaming';

export function toApiPropertiesObject(
    object: Record<string, any>,
    options?: PropertyNamingOptions,
): Record<string, any> {
    return propertyNaming(object, {
        ...options,
        keyTransformer: snakeCase,
    });
}
import { isImmutable } from 'immutable';
import { isMoment } from 'moment';

export interface PropertyNamingOptions {
    deep?: boolean;
    keyTransformer?: (key: string) => string;
}

function cannotBeConverted(data: any) {
    return (
        !data ||
        isMoment(data) ||
        isImmutable(data) ||
        data instanceof Blob ||
        data instanceof Set ||
        data instanceof Map ||
        data instanceof Date ||
        data instanceof File ||
        data instanceof Event ||
        data instanceof FormData ||
        data instanceof ArrayBuffer ||
        data instanceof Uint8Array ||
        data instanceof Uint16Array ||
        data instanceof Uint32Array
    );
}

export function propertyNaming(object: any, options?: PropertyNamingOptions): Record<string, any> {
    if (!object || typeof object !== 'object' || cannotBeConverted(object)) {
        return object;
    }

    if (Array.isArray(object)) {
        return object.map((value) => propertyNaming(value, options));
    }

    const canGoDeep = typeof options?.deep === 'undefined' || options?.deep;
    return Object.entries(object).reduce(
        (prev, [key, value]) => ({
            ...prev,
            [options?.keyTransformer?.(key) || key]: canGoDeep ? propertyNaming(value, options) : value,
        }),
        {},
    );
}

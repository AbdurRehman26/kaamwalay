export interface PropertyNamingOptions {
    deep?: boolean;
    keyTransformer?: (key: string) => string;
}

export function propertyNaming(object: Record<string, any>, options?: PropertyNamingOptions): Record<string, any> {
    if (!object || typeof object !== 'object') {
        return object;
    }

    return Object.entries(object).reduce(
        (prev, [key, value]) => ({
            ...prev,
            [options?.keyTransformer?.(key) || key]: options?.deep ? propertyNaming(value, options) : value,
        }),
        {},
    );
}

export interface StringifyOptions {
    includeFunctions?: boolean;
}

/**
 * Json stringifier build to avoid json circular values
 * @param data
 * @param space
 * @param includeFunctions
 * @return {string}
 */
export const stringify = (data: any, space?: string | number, { includeFunctions = false }: StringifyOptions = {}) => {
    let cache: any = [];

    if (data.toJSON) {
        data = data.toJSON(space);
    } else if (data.toJS) {
        data = data.toJS();
    }

    const result = JSON.stringify(
        data,
        (key, value) => {
            if (key.startsWith('_')) {
                return undefined;
            }

            if (!includeFunctions && typeof value === 'function') {
                return undefined;
            }

            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    if (value.toJSON) {
                        value = value.toJSON();
                    } else if (value.toJS) {
                        value = value.toJS();
                    }

                    try {
                        return JSON.parse(
                            JSON.stringify(
                                value,
                                (k, v) => {
                                    if (k.startsWith('_')) {
                                        return undefined;
                                    }

                                    if (v && v.toJSON) {
                                        return v.toJSON();
                                    }

                                    if (v && v.toJS) {
                                        return v.toJS();
                                    }

                                    return v;
                                },
                                space,
                            ),
                        );
                    } catch (error: any) {
                        return '[JSON circular]';
                    }
                }

                cache.push(value);
            }

            return value;
        },
        space,
    );

    cache = null;

    return result;
};

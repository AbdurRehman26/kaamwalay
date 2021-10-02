import { stringify, StringifyOptions } from './stringify';

/**
 * Convert the type we send to a plain js object.
 * @param data
 * @param options
 */
export const toJS = (data: any, options?: StringifyOptions) => {
    try {
        return JSON.parse(stringify(data, void 0, options));
    } catch (e) {
        return data;
    }
};

import { stringify, StringifyOptions } from './stringify';

/**
 * Convert the type we send to a plain js object.
 * @param data
 * @param options
 */
export const toJS = (data: any, options?: StringifyOptions) => JSON.parse(stringify(data, void 0, options));

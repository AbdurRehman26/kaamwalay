/**
 * Source https://github.com/sindresorhus/is-plain-obj/blob/main/index.js
 * @param value
 */
export function isPlainObject(value: any): boolean {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}

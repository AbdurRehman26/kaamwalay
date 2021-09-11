import { cleanUrl } from './cleanUrl';

const PATH_SEPARATOR = '/';
const MUSTACHE_REGEX = /{{([\s\S]+?)}}/g;
const COLON_REGEX = /^:([\s\S]+?)$/g;

function getValue(key: string, params?: Record<string, any>) {
    return (params ?? {})[key.trim()] ?? '';
}

/**
 * Build an url
 * @param url
 * @param params
 */
export function buildUrl(url: string, params?: Record<string, any>) {
    const words = cleanUrl(url)
        .split(PATH_SEPARATOR)
        .map((word) => {
            word = word.trim();

            if (COLON_REGEX.test(word)) {
                return word.replace(COLON_REGEX, (match, value) => getValue(value, params));
            }

            if (MUSTACHE_REGEX.test(word)) {
                return word.replace(MUSTACHE_REGEX, (match, value) => getValue(value, params));
            }

            return word;
        });

    return cleanUrl(words.join(PATH_SEPARATOR));
}

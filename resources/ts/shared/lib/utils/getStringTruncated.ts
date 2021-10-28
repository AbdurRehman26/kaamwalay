export function getStringTruncated(stringToTruncate: string, maxLength: number) {
    if (stringToTruncate.length > maxLength) {
        return stringToTruncate
            .replace(/<[^>]*>?/gm, '')
            .slice(0, maxLength)
            .concat('...');
    }
    return stringToTruncate;
}

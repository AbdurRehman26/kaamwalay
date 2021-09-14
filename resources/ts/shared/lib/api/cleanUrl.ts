export function cleanUrl(url: string) {
    return url
        .replace(/\/\/\//g, '/')
        .replace(/\/\//g, '/')
        .replace(/^(https?):\//, '$1://');
}

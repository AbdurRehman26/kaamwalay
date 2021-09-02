export function ensureEndSlash(path: string) {
    return path.replace(/\/$/g, '') + '/';
}

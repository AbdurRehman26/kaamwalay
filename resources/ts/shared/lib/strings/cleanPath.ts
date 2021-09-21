export function cleanPath(path: string) {
    return path
        .split('/')
        .map((segment) => segment.trim())
        .filter(Boolean)
        .join('/');
}

export function tagResponse<T>(tag: T, data?: null | any[]): { type: T; id?: string | number }[] {
    return (data ?? []).map(({ id }) => ({ type: tag, id }));
}

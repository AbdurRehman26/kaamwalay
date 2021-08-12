export function endpointsToReducer(endpoints: any) {
    return Object.entries(endpoints).reduce(
        (prev, [, endpoint]: any) => ({
            ...prev,
            [endpoint.reducerPath]: endpoint.reducer,
        }),
        {} as any,
    );
}

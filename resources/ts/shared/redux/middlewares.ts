import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/src/getDefaultMiddleware';

export function defaultMiddlewares<S>(getDefaultMiddleware: CurriedGetDefaultMiddleware<S>) {
    return getDefaultMiddleware({
        serializableCheck: {
            // Ignore action payload serialization check, to allow passing object data.
            ignoredActionPaths: ['meta.arg', 'payload'],
        },
    });
}

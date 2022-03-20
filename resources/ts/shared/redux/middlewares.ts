import { CurriedGetDefaultMiddleware, ThunkMiddlewareFor } from '@reduxjs/toolkit/src/getDefaultMiddleware';
import { ExcludeFromTuple } from '@reduxjs/toolkit/src/tsHelpers';
import { MiddlewareArray } from '@reduxjs/toolkit/src/utils';

export function defaultMiddlewares<S>(getDefaultMiddleware: CurriedGetDefaultMiddleware<S>): MiddlewareArray<
    ExcludeFromTuple<
        [
            ThunkMiddlewareFor<
                S,
                {
                    serializableCheck: {
                        // Ignore action payload serialization check, to allow passing object data.
                        ignoredActionPaths: ['meta.arg', 'payload'];
                    };
                }
            >,
        ],
        never
    >
> {
    return getDefaultMiddleware({
        serializableCheck: {
            // Ignore action payload serialization check, to allow passing object data.
            ignoredActionPaths: ['meta.arg', 'payload'],
        },
    });
}

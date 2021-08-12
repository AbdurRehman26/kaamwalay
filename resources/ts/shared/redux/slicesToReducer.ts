import { Slice } from '@reduxjs/toolkit';

import { ReducersType } from '@shared/redux/types';

export function slicesToReducer<S extends Record<string, Slice>>(slices: S) {
    return Object.entries(slices).reduce(
        (prev, [key, slice]) => ({
            ...prev,
            [key as any]: slice.reducer,
        }),
        {} as ReducersType<S>,
    );
}

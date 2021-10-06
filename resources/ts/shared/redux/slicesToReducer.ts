import { Slice } from '@reduxjs/toolkit';
import { ReducersType } from '@shared/redux/types';

export function slicesToReducer<S extends Record<string, Slice>>(slices: S) {
    return Object.values(slices).reduce(
        (prev, slice) => ({
            ...prev,
            [slice.name]: slice.reducer,
        }),
        {} as ReducersType<S>,
    );
}

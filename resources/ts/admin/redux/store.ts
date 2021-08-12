import { configureStore } from '@reduxjs/toolkit';

import * as globalSlices from '@shared/redux/slices';
import { slicesToReducer } from '@shared/redux/slicesToReducer';
import { setGlobalStore } from '@shared/redux/store';

import * as slices from './slices';

export const store = configureStore({
    reducer: slicesToReducer({
        ...slices,
        ...globalSlices,
    }),
});

setGlobalStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

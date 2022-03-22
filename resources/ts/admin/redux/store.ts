import { Dispatch, configureStore } from '@reduxjs/toolkit';
import { defaultMiddlewares } from '@shared/redux/middlewares';
import * as globalSlices from '@shared/redux/slices';
import { slicesToReducer } from '@shared/redux/slicesToReducer';
import { setGlobalStore } from '@shared/redux/store';
import * as slices from './slices';

export const store = configureStore({
    middleware: (getDefaultMiddleware) => defaultMiddlewares(getDefaultMiddleware),
    reducer: slicesToReducer({
        ...slices,
        ...globalSlices,
    }),
});

setGlobalStore(store);

type Store = typeof store;

export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Dispatch<any>;

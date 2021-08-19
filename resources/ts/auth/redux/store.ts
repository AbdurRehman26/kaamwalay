import { configureStore } from '@reduxjs/toolkit';
import { defaultMiddlewares } from '@shared/redux/middlewares';
import * as globalSlices from '@shared/redux/slices';
import { slicesToReducer } from '@shared/redux/slicesToReducer';
import { setGlobalStore } from '@shared/redux/store';

export const store = configureStore({
    middleware: (getDefaultMiddleware) => defaultMiddlewares(getDefaultMiddleware),
    reducer: slicesToReducer({
        ...globalSlices,
    }),
});

setGlobalStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

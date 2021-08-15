import { EnhancedStore } from '@reduxjs/toolkit';
import * as slices from './slices';
import { StateType } from './types';

type SlicesType = typeof slices;
export type GlobalStateType = StateType<SlicesType>;
export type GlobalStoreType = EnhancedStore<StateType<SlicesType>, any>;
let globalReduxStore: GlobalStoreType;

export function setGlobalStore(store: EnhancedStore) {
    globalReduxStore = store;

    return globalReduxStore;
}

export function getGlobalStore() {
    return globalReduxStore;
}

export function GlobalDispatch(
    ...args: Parameters<GlobalStoreType['dispatch']>
): ReturnType<GlobalStoreType['dispatch']> {
    return globalReduxStore.dispatch(...args);
}

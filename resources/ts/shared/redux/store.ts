import { EnhancedStore } from '@reduxjs/toolkit';
import * as slices from './slices';
import { StateType } from './types';

type SlicesType = typeof slices;
export type GlobalStateType = StateType<SlicesType>;
export type GlobalStoreType = EnhancedStore<GlobalStateType, any, any>;

let globalReduxStore: GlobalStoreType;

export function setGlobalStore(store: EnhancedStore) {
    globalReduxStore = store;

    return globalReduxStore;
}

export function getGlobalStore() {
    return globalReduxStore;
}

export const GlobalDispatch: GlobalStoreType['dispatch'] = (action) => {
    return globalReduxStore.dispatch(action);
};

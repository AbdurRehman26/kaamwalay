import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { GlobalStoreType } from '@shared/redux/store';

export const useSharedSelector: TypedUseSelectorHook<ReturnType<GlobalStoreType['getState']>> = useSelector;

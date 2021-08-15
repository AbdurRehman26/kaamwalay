import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { GlobalStateType } from '@shared/redux/store';

export const useSharedSelector: TypedUseSelectorHook<GlobalStateType> = useSelector;

import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { GlobalStateType } from '../redux/store';

export const useSharedSelector: TypedUseSelectorHook<GlobalStateType> = useSelector;

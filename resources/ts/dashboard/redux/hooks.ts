import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`, this way things will be a lot easier
// with typescript
export const useAppDispatch = () => useDispatch<any>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

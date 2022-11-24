import { useCallback } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { drawerVisibility } from '../redux/slices/pageSlice';

export function useSidebar(): [state: boolean, setVisibility: (visibility: boolean) => void] {
    const dispatch = useAppDispatch();
    const drawerState = useAppSelector((state) => state.pageSlice.drawerOpened);
    const setVisibility = useCallback(
        (state: boolean) => {
            dispatch(drawerVisibility(state));
        },
        [dispatch],
    );

    return [drawerState, setVisibility];
}

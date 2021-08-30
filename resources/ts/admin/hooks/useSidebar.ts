import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { drawerVisibility } from '../redux/slices/pageSlice';

export function useSidebar(): [state: boolean, setVisibility: (visibility: boolean) => void] {
    const dispatch = useAppDispatch();
    const drawerState = useAppSelector((state) => state.page.drawerOpened);
    const setVisibility = useCallback(
        (state: boolean) => {
            dispatch(drawerVisibility(state));
        },
        [dispatch],
    );

    return [drawerState, setVisibility];
}

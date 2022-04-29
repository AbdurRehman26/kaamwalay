import { useCallback } from 'react';
import { Modals, closeModal, openModal, setModalData } from '../redux/slices/modalsSlice';
import { useSharedDispatch } from './useSharedDispatch';

export function useLoadingModal() {
    const dispatch = useSharedDispatch();

    const open = useCallback((data?: Modals['loading']) => dispatch(openModal('loading', data)), [dispatch]);

    const setData = useCallback(
        (data: Partial<Modals['loading']>) => dispatch(setModalData('loading', data)),
        [dispatch],
    );

    const close = useCallback(() => dispatch(closeModal('loading')), [dispatch]);

    return { open, setData, close };
}

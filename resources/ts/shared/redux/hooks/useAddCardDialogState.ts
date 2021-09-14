import { useSharedSelector } from '@shared/hooks/useSharedDispatch';

export function useAddCardDialogState() {
    return useSharedSelector((state) => state.addCardDialog);
}

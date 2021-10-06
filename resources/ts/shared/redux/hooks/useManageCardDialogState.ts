import { useSharedSelector } from '@shared/hooks/useSharedDispatch';

export function useManageCardDialogState() {
    return useSharedSelector((state) => state.manageCardDialog);
}

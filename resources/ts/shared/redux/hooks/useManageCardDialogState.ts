import { useSharedSelector } from '@shared/hooks/useSharedSelector';

export function useManageCardDialogState() {
    return useSharedSelector((state) => state.manageCardDialog);
}

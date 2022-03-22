import { forwardRef } from 'react';
import ManageCardDialogCreateCardView from '@shared/components/ManageCardDialog/ManageCardDialogCreateCardView';
import { ManageCardDialogViewProps } from '@shared/components/ManageCardDialog/ManageCardDialogView';

interface ManageCardDialogCreateCardProps extends Omit<ManageCardDialogViewProps, 'isSwappable'> {}
export const ManageCardDialogCreateCard = forwardRef<HTMLDivElement, ManageCardDialogCreateCardProps>(
    ({ onAdd, declaredValue }, ref) => {
        return <ManageCardDialogCreateCardView isSwappable onAdd={onAdd} declaredValue={declaredValue} ref={ref} />;
    },
);

export default ManageCardDialogCreateCard;

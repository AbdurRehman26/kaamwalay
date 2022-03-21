import { forwardRef } from 'react';
import { ManageCardDialogViewProps } from '@shared/components/ManageCardDialog/ManageCardDialogView';
import ManageCardDialogCreateSetView from '@shared/components/ManageCardDialog/ManageCardDialogCreateSetView';

interface ManageCardDialogCreateCardProps extends Omit<ManageCardDialogViewProps, 'isSwappable'> {}
export const ManageCardDialogCreateSet = forwardRef<HTMLDivElement, ManageCardDialogCreateCardProps>(
    ({ onAdd, declaredValue }, ref) => {
        return <ManageCardDialogCreateSetView isSwappable onAdd={onAdd} declaredValue={declaredValue} ref={ref} />;
    },
);

export default ManageCardDialogCreateSet;

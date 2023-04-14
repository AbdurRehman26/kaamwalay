import { forwardRef } from 'react';
import ManageCardDialogCreateCategoryView from '@shared/components/ManageCardDialog/ManageCardDialogCreateCategoryView';
import { ManageCardDialogViewProps } from '@shared/components/ManageCardDialog/ManageCardDialogView';

interface ManageCardDialogCreateCardProps extends Omit<ManageCardDialogViewProps, 'isSwappable'> {}
export const ManageCardDialogCreateCategory = forwardRef<HTMLDivElement, ManageCardDialogCreateCardProps>(
    ({ onAdd, declaredValue }, ref) => {
        return <ManageCardDialogCreateCategoryView isSwappable onAdd={onAdd} declaredValue={declaredValue} ref={ref} />;
    },
);

export default ManageCardDialogCreateCategory;

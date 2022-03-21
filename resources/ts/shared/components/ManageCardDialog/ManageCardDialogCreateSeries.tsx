import { forwardRef } from 'react';
import { ManageCardDialogViewProps } from '@shared/components/ManageCardDialog/ManageCardDialogView';
import ManageCardDialogCreateSeriesView from '@shared/components/ManageCardDialog/ManageCardDialogCreateSeriesView';

interface ManageCardDialogCreateCardProps extends Omit<ManageCardDialogViewProps, 'isSwappable'> {}
export const ManageCardDialogCreateSeries = forwardRef<HTMLDivElement, ManageCardDialogCreateCardProps>(
    ({ onAdd, declaredValue }, ref) => {
        return <ManageCardDialogCreateSeriesView isSwappable onAdd={onAdd} declaredValue={declaredValue} ref={ref} />;
    },
);

export default ManageCardDialogCreateSeries;

import { forwardRef } from 'react';
import ManageCardDialogView, {
    ManageCardDialogViewProps,
} from '@shared/components/ManageCardDialog/ManageCardDialogView';

interface ManageCardDialogEditProps extends Omit<ManageCardDialogViewProps, 'isSwappable'> {}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialogEdit
 * @date: 14.09.2021
 * @time: 22:17
 */
export const ManageCardDialogEdit = forwardRef<HTMLDivElement, ManageCardDialogEditProps>(
    ({ onAdd, declaredValue }, ref) => {
        return <ManageCardDialogView isSwappable onAdd={onAdd} declaredValue={declaredValue} ref={ref} />;
    },
);

export default ManageCardDialogEdit;

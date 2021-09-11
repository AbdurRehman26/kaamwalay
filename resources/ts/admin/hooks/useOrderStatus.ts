import { useMemo } from 'react';
import { StatusChipColor } from '@shared/components/StatusChip';
import { OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';

export function useOrderStatus(orderStatus: OrderStatusEntity): [statusType: StatusChipColor, label: string] {
    return useMemo(() => {
        const meta = (OrderStatusMap as Record<number, any>)[orderStatus?.id];
        if (meta) {
            return [meta.value, meta.label];
        }

        return ['pending', 'Pending'];
    }, [orderStatus?.id]);
}

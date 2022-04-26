import { useMemo } from 'react';
import { StatusChipColor } from '@shared/components/StatusChip';
import { AdminOrderStatusMap, OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';

export function useOrderStatus(
    orderStatus: OrderStatusEntity,
    { inVault }: Record<string, any> = {},
): [statusType: StatusChipColor, label: string] {
    return useMemo(() => {
        const meta = (AdminOrderStatusMap as Record<number, any>)[orderStatus?.id];

        if (orderStatus.id === OrderStatusEnum.SHIPPED && inVault) {
            return [meta.value, 'In Vault'];
        }

        if (meta) {
            return [meta.value, meta.label];
        }

        return ['pending', 'Pending'];
    }, [inVault, orderStatus.id]);
}

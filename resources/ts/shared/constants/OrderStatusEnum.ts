export enum OrderStatusEnum {
    INCOMPLETE = 1,
    PLACED = 2,
    CONFIRMED = 3,
    GRADED = 4,
    SHIPPED = 5,
    CANCELLED = 6,
    REVIEWED = 7,
    IN_VAULT = 8,
}

export const OrderStatusMap = {
    [OrderStatusEnum.INCOMPLETE]: { label: 'Incomplete', value: 'incomplete' },
    [OrderStatusEnum.PLACED]: { label: 'Placed', value: 'placed' },
    [OrderStatusEnum.CONFIRMED]: { label: 'Reviewed', value: 'confirmed' },
    [OrderStatusEnum.GRADED]: { label: 'Graded', value: 'graded' },
    [OrderStatusEnum.SHIPPED]: { label: 'Shipped', value: 'shipped' },
    [OrderStatusEnum.CANCELLED]: { label: 'Cancelled', value: 'cancelled' },
    [OrderStatusEnum.REVIEWED]: { label: 'Reviewed', value: 'reviewed' },
    [OrderStatusEnum.IN_VAULT]: { label: 'Stored In Vault', value: 'in_vault' },
};

export const AdminOrderStatusMap = {
    ...OrderStatusMap,
    [OrderStatusEnum.PLACED]: { label: 'Pending', value: 'pending' },
};

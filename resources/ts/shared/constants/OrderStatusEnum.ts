export enum OrderStatusEnum {
    PLACED = 2,
    CONFIRMED = 3,
    GRADED = 4,
    SHIPPED = 5,
    CANCELLED = 6,
    ASSEMBLED = 7,
}

export const OrderStatusMap = {
    [OrderStatusEnum.PLACED]: { label: 'Placed', value: 'placed' },
    [OrderStatusEnum.CONFIRMED]: { label: 'Reviewed', value: 'confirmed' },
    [OrderStatusEnum.GRADED]: { label: 'Graded', value: 'graded' },
    [OrderStatusEnum.SHIPPED]: { label: 'Shipped', value: 'shipped' },
    [OrderStatusEnum.CANCELLED]: { label: 'Cancelled', value: 'cancelled' },
    [OrderStatusEnum.ASSEMBLED]: { label: 'Assembled', value: 'assembled' },
};

export const AdminOrderStatusMap = {
    ...OrderStatusMap,
    [OrderStatusEnum.PLACED]: { label: 'Pending', value: 'pending' },
};

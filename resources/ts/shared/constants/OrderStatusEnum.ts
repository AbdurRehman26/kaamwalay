export enum OrderStatusEnum {
    PAYMENT_PENDING = 1,
    PLACED = 2,
    ARRIVED = 3,
    GRADED = 4,
    SHIPPED = 5,
    CANCELLED = 6,
    REVIEWED = 7,
}

export const OrderStatusMap = {
    [OrderStatusEnum.PAYMENT_PENDING]: { label: 'Pending', value: 'pending_payment' },
    [OrderStatusEnum.PLACED]: { label: 'Placed', value: 'placed' },
    [OrderStatusEnum.ARRIVED]: { label: 'Reviewed', value: 'arrived' },
    [OrderStatusEnum.GRADED]: { label: 'Graded', value: 'graded' },
    [OrderStatusEnum.SHIPPED]: { label: 'Shipped', value: 'shipped' },
    [OrderStatusEnum.CANCELLED]: { label: 'Cancelled', value: 'cancelled' },
    [OrderStatusEnum.REVIEWED]: { label: 'Reviewed', value: 'reviewed' },
};

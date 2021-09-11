import { OrderItemStatusEnum } from '../constants/OrderItemStatusEnum';

export class ChangeOrderItemStatusDto {
    orderId!: number;
    orderItemId!: number;
    orderItemStatus!: OrderItemStatusEnum;
    notes?: string;
}

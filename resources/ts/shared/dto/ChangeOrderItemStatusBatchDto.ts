import { OrderItemStatusEnum } from '../constants/OrderItemStatusEnum';

export class ChangeOrderItemStatusBatchDto {
    orderId!: number;
    orderItemStatus!: OrderItemStatusEnum;
    items!: number[];
}

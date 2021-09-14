import { OrderStatusEnum } from '../constants/OrderStatusEnum';

export class AddOrderStatusHistoryDto {
    orderId!: number;
    orderStatusId!: OrderStatusEnum;
}

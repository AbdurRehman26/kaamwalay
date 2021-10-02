import { Type } from 'class-transformer';
import { Entity } from '@shared/entities/Entity';
import { OrderStatusEntity } from './OrderStatusEntity';

export class OrderStatusHistoryEntity extends Entity {
    public orderId!: number;
    public orderStatusId!: number;

    @Type(() => OrderStatusEntity)
    public orderStatus!: OrderStatusEntity;
}

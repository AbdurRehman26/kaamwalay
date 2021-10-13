import { OrderItemStatusEntity } from '@shared/entities/OrderItemStatusEntity';
import { Entity } from './Entity';

export class OrderItemStatusHistoryEntity extends Entity {
    public notes!: string;
    public orderItemStatus!: OrderItemStatusEntity;
}

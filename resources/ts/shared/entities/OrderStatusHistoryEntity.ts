import { Entity } from '@shared/entities/Entity';
import { Field } from '../decorators/Field';
import { OrderStatusEntity } from './OrderStatusEntity';

export class OrderStatusHistoryEntity extends Entity {
    @Field('order_id')
    public orderId!: number;

    @Field('order_status_id')
    public orderStatusId!: number;

    @Field('order_status')
    public orderStatus!: OrderStatusEntity;
}

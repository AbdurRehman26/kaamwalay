import { Field } from '../decorators/Field';
import { CardProductEntity } from './CardProductEntity';
import { Entity } from './Entity';
import { OrderItemStatusEntity } from './OrderItemStatusEntity';

export class OrderItemEntity extends Entity {
    public quantity!: number;

    public status!: OrderItemStatusEntity;

    @Field('declared_value_per_unit')
    public declaredValuePerUnit!: number;

    @Field('card_product')
    public cardProduct!: CardProductEntity;

    @Field('certificate_number')
    public certificateNumber!: string;

    @Field('order_id')
    public orderId!: number;
}

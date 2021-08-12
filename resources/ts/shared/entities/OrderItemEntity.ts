import { Field } from '../decorators/Field';
import { CardProductEntity } from './CardProductEntity';
import { Entity } from './Entity';

export class OrderItemEntity extends Entity {
    public quantity!: number;

    @Field('declared_value_per_unit')
    public declaredValuePerUnit!: number;

    @Field('card_product')
    public cardProduct!: CardProductEntity;
}

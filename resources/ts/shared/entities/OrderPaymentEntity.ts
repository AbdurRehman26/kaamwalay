import { Field } from '../decorators/Field';
import { CardEntity } from './CardEntity';
import { Entity } from './Entity';

export class OrderPaymentEntity extends Entity {
    @Field('card', () => CardEntity)
    public card!: CardEntity;
}

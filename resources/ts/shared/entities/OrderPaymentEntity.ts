import { Type } from 'class-transformer';
import { Field } from '../decorators/Field';
import { CardEntity } from './CardEntity';
import { Entity } from './Entity';
import { PayerEntity } from './PayerEntity';

export class OrderPaymentEntity extends Entity {
    @Field('card', () => CardEntity)
    public card?: CardEntity | null;

    @Type(() => PayerEntity)
    public payer?: PayerEntity | null;
}

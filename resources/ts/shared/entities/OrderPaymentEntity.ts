import { Type } from 'class-transformer';
import { CardEntity } from './CardEntity';
import { Entity } from './Entity';

export class OrderPaymentEntity extends Entity {
    @Type(() => CardEntity)
    public card!: CardEntity;
}

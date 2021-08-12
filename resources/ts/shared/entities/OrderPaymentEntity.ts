import { CardEntity } from './CardEntity';
import { Entity } from './Entity';

export class OrderPaymentEntity extends Entity {
    public card!: CardEntity;
}

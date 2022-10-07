import { Type } from 'class-transformer';
import { CardCategoryEntity } from './CardCategoryEntity';
import { Entity } from './Entity';

export class CardRarityEntity extends Entity {
    public name!: string;

    @Type(() => CardCategoryEntity)
    public coupon!: CardCategoryEntity;
}

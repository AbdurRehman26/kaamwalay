import { Type } from 'class-transformer';
import { CardCategoryEntity } from './CardCategoryEntity';
import { Entity } from './Entity';

export class CardSurfaceEntity extends Entity {
    public name!: string;

    @Type(() => CardCategoryEntity)
    public cardCategory!: CardCategoryEntity;
}

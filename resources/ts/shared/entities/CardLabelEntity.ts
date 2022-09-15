import { Type } from 'class-transformer';
import { CardProductEntity } from './CardProductEntity';
import { Entity } from './Entity';

export class CardLabelEntity extends Entity {
    public lineOne!: string;
    public lineTwo!: string;
    public lineThree!: string;
    public lineFour!: string;
    public nickName!: string;
    public certificateNumber!: string;
    public grade!: number;

    @Type(() => CardProductEntity)
    public cardProduct!: CardProductEntity;
}

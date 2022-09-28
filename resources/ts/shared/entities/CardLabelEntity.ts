import { Type } from 'class-transformer';
import { CardProductEntity } from './CardProductEntity';

export class CardLabelEntity {
    public cardLabelId!: number;
    public lineOne!: string;
    public lineTwo!: string;
    public lineThree!: string;
    public lineFour!: string;
    public nickName?: string;
    public certificateNumber?: string;
    public grade?: number;
    public persistChanges?: boolean;

    @Type(() => CardProductEntity)
    public cardProduct?: CardProductEntity;
}

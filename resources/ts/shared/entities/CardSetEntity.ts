import { Entity } from './Entity';

export class CardSetEntity extends Entity {
    public name!: string;
    public imagePath!: string;
    public releaseDate!: string;
    public cardSeriesId!: number;
}

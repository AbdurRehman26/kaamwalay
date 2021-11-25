import { Entity } from './Entity';

export class CardProductEntity extends Entity {
    public name!: string;
    public cardCategoryName!: string;
    public cardSetName!: string;
    public cardSeriesName!: string;
    public releaseYear!: number;
    public releaseDate!: string;
    public cardNumberOrder!: string;
    public imagePath!: string;
    public shortName!: string;
    public longName!: string;
    public addedByCustomer!: boolean;

    public getName() {
        return this.name || 'Unknown';
    }

    public getShortName() {
        return this.shortName;
    }

    public getLongName() {
        return this.longName || 'Unknown';
    }
}

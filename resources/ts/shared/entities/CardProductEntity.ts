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
    public fullName!: string;
    public shortName!: string;
    public longName!: string;

    public getName() {
        return this.name || 'Unknown';
    }

    public getDescription() {
        return this.longName || 'No card description.';
    }

    public getFullName() {
        return this.fullName;
    }

    public getShortName() {
        return this.shortName;
    }
}

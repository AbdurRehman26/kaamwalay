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

    public getName() {
        return this.getShortName() || 'Unknown';
    }

    public getDescription() {
        return this.getFullName() || 'No card description.';
    }

    public getFullName() {
        return this.fullName;
    }

    public getShortName() {
        return this.shortName;
    }
}

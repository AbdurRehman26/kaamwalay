import { Entity } from './Entity';

interface CardSurface {
    label: string;
    name: string;
}
interface CardRarity {
    label: string;
    name: string;
}
interface CardSets {
    id: number;
    cardSeriesId: number;
    label: string;
    name: string;
    imagePath: string;
    releaseDate: string;
}
interface CardSeries {
    id: number;
    label: string;
    name: string;
    imagePath: string;
}
export class CardProductEntity extends Entity {
    public name!: string;
    public cardCategoryName!: string;
    public cardSetName!: CardSets;
    public cardSeriesName!: CardSeries;
    public releaseYear!: number;
    public releaseDate!: string;
    public cardNumberOrder!: string;
    public cardNumber!: string;
    public population!: number;
    public imagePath!: string | null;
    public shortName!: string;
    public longName!: string;
    public addedByCustomer!: boolean;
    public surface!: CardSurface;
    public variant!: string;
    public language!: string;
    public rarity!: CardRarity;
    public edition!: string;

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

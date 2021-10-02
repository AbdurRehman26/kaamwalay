import { Entity } from './Entity';

export class CardProductEntity extends Entity {
    public name!: string;
    public cardCategoryName!: string;
    public cardSetName!: string;
    public cardSeriesName!: string;
    public releaseYear!: number;
    public cardNumberOrder!: string;
    public imagePath!: string;

    public getName() {
        return this.name || 'Unknown';
    }

    public getDescription() {
        const content = [
            this.releaseYear,
            this.cardCategoryName,
            this.cardSeriesName,
            this.cardSetName,
            this.cardNumberOrder,
            this.name,
        ]
            .map((item) => `${item ?? ''}`)
            .filter(Boolean)
            .join(' ')
            .trim();

        return content || 'No card description.';
    }
}

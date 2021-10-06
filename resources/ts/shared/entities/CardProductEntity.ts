import { Field } from '@shared/decorators/Field';
import { Entity } from './Entity';

export class CardProductEntity extends Entity {
    public name!: string;

    @Field('card_category_name')
    public cardCategoryName!: string;

    @Field('card_set_name')
    public cardSetName!: string;

    @Field('card_series_name')
    public cardSeriesName!: string;

    @Field('release_year')
    public releaseYear!: number;

    @Field('card_number_order')
    public cardNumberOrder!: string;

    @Field('image_path')
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

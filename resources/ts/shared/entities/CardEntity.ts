import { Field } from '../decorators/Field';

export class CardEntity {
    public brand!: string;
    public last4!: string;

    @Field('exp_month')
    public expMonth!: number;

    @Field('exp_year')
    public expYear!: number;
}

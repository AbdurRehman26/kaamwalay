import { Field } from '../decorators/Field';
import { CountryEntity } from './CountryEntity';
import { Entity } from './Entity';

export class AddressEntity extends Entity {
    public address!: number;
    public city!: number;
    public state!: number;
    public zip!: number;
    public phone!: number;
    public flat!: number;

    @Field('first_name')
    public firstName!: number;

    @Field('last_name')
    public lastName!: number;

    @Field()
    public country!: CountryEntity;
}

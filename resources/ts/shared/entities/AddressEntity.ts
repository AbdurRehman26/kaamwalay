import { Field } from '../decorators/Field';
import { CountryEntity } from './CountryEntity';
import { Entity } from './Entity';

export class AddressEntity extends Entity {
    public address!: string;
    public city!: string;
    public state!: string;
    public zip!: string;
    public phone!: string;
    public flat!: string;

    @Field('first_name')
    public firstName!: string;

    @Field('last_name')
    public lastName!: string;

    @Field()
    public country!: CountryEntity;

    public getFullName() {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }

    public getAddressLine2() {
        const lines = [this.city, `${this.state ?? ''} ${this.zip ?? ''}`, this.country.code];
        return lines.map((line) => `${line ?? ''}`.trim()).filter(Boolean);
    }

    public getAddress() {
        return this.address;
    }
}

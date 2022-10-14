import { Type } from 'class-transformer';
import { CountryEntity } from './CountryEntity';
import { Entity } from './Entity';

export class AddressEntity extends Entity {
    public address!: string;
    public address2!: string;
    public city!: string;
    public state!: string;
    public zip!: string;
    public phone!: string;
    public flat!: string;
    public countryId!: number;
    public fullName!: string;

    public firstName!: string;

    public lastName!: string;

    @Type(() => CountryEntity)
    public country!: CountryEntity;

    public getFirstName() {
        const arr = this.fullName?.split(' ');
        return this.fullName
            ?.split(' ')
            .slice(0, arr.length - 1)
            .toString()
            .replace(/,/g, ' ');
    }

    public getLastName() {
        const arr = this.fullName?.split(' ');
        return this.fullName?.split(' ')[arr.length - 1];
    }

    public getFullName() {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }

    public getAddressLine2() {
        const lines = [
            this.flat ? `APT # ${this.flat}` : '',
            this.city,
            `${this.state ?? ''} ${this.zip ?? ''}`,
            this.country.code,
        ];

        return lines
            .map((line) => `${line ?? ''}`.trim())
            .filter(Boolean)
            .join(', ');
    }

    public getAddress() {
        return `${this.address} ${this.address2 || ''}`;
    }
}

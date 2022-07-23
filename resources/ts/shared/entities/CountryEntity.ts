import { Entity } from './Entity';

export class CountryEntity extends Entity {
    public code!: string;
    public name!: string;
    public phoneCode!: string;
}

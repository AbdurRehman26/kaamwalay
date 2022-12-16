import { Entity } from './Entity';

export class PromoCodeUserEntity extends Entity {
    public email!: string;
    public firstName!: string;
    public lastName!: string;

    public getFullName() {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }
}

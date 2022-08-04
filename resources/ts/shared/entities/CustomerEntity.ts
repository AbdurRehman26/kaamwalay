import { Entity } from './Entity';
import { WalletEntity } from './WalletEntity';

export class CustomerEntity extends Entity {
    public profileImage!: string | null;
    public fullName!: string;
    public customerNumber!: string;
    public email!: string;
    public phone!: string;
    public submissions!: number;
    public cardsCount!: number;
    public wallet!: WalletEntity;
    public signedUpAt!: string;
    public createdBy!: string;
    public lastLoginAt!: string;

    public getFullName() {
        return this.fullName;
    }
}

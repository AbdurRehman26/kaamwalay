import { Entity } from './Entity';
import { UserEntity } from './UserEntity';
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
    public createdBy!: UserEntity;
    public lastLoginAt!: string;

    public getFullName() {
        return this.fullName;
    }
}

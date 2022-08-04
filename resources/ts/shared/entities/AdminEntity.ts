import { Type } from 'class-transformer';
import { Entity } from './Entity';
import { RoleEntity } from './RoleEntity';
import { WalletEntity } from './WalletEntity';

export class AdminEntity extends Entity {
    public customerNumber!: string;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public userName!: string;
    public profileImage!: string | null;
    public phone!: string;
    public stripeId!: string;

    public wallet!: WalletEntity;

    @Type(() => RoleEntity)
    public roles!: RoleEntity[];

    public getFullName() {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }
}

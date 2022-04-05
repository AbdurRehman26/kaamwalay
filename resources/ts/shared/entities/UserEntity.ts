import { Type } from 'class-transformer';
import { Moment } from 'moment';
import { WalletEntity } from '@shared/entities/WalletEntity';
import { nameInitials } from '@shared/lib/strings/initials';
import { RolesEnum } from '../constants/RolesEnum';
import { DateField } from '../decorators/DateField';
import { Entity } from './Entity';
import { RoleEntity } from './RoleEntity';

export class UserEntity extends Entity {
    public username!: string;
    public email!: string;
    public phone!: string;
    public firstName!: string;
    public lastName!: string;
    public stripeId!: string;
    public customerNumber!: string;
    public profileImage!: string;
    public emailSubscription!: number;

    public wallet!: WalletEntity;

    @DateField()
    public emailVerifiedAt!: Moment;

    @Type(() => RoleEntity)
    public roles!: RoleEntity[];

    public getFullName() {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }

    public hasRole(role: RolesEnum): boolean {
        return !!this.roles.find(({ id }) => id === role);
    }

    public getInitials() {
        return nameInitials(this.getFullName());
    }
}

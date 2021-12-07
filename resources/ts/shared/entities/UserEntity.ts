import { Type } from 'class-transformer';
import { Moment } from 'moment';
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
    public profileImage!: string | null;

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
        const name = this.getFullName();
        let words = name.split(' ');
        if (words.length > 1) {
            words = words.map((word) => word.charAt(0));
        }

        return words.join('').substr(0, 2);
    }
}

import { Type } from 'class-transformer';
import { Moment } from 'moment';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { Entity } from '@shared/entities/Entity';
import { Field } from '../decorators/Field';
import { RoleEntity } from './RoleEntity';

export class UserEntity extends Entity {
    public username!: string;
    public email!: string;
    public phone!: string;

    @Field('first_name')
    public firstName!: string;

    @Field('last_name')
    public lastName!: string;

    @Field('email_verified_at')
    public emailVerifiedAt!: Moment;

    @Field('stripe_id')
    public stripeId!: string;

    @Field('customer_number')
    public customerNumber!: string;

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

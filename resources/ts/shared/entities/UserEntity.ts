import { Type } from 'class-transformer';
import { Moment } from 'moment';

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

    @Type(() => RoleEntity)
    public roles!: RoleEntity[];

    public getFullName() {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }
}

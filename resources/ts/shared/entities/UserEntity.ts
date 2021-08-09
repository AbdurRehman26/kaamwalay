import { Expose } from 'class-transformer';

import { Entity } from '@shared/entities/Entity';

export class UserEntity extends Entity {
    public username!: string;
    public email!: string;
    public phone!: string;

    @Expose({ name: 'first_name' })
    public firstName!: string;

    @Expose({ name: 'last_name' })
    public lastName!: string;

    @Expose({ name: 'email_verified_at' })
    public emailVerifiedAt!: Date;
}

import { Expose } from 'class-transformer';

import { Entity } from '@shared/entities/Entity';

export class UserEntity extends Entity {
    public email!: string;
    public name!: string;

    @Expose({ name: 'email_verified_at' })
    public emailVerifiedAt!: Date;
}

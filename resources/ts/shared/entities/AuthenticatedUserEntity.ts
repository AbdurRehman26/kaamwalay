import { Expose, Type } from 'class-transformer';

import { UserEntity } from './UserEntity';

export class AuthenticatedUserEntity {
    @Type()
    public user!: UserEntity;

    @Expose({ name: 'access_token' })
    public accessToken!: string;
}

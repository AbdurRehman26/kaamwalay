import { Type } from 'class-transformer';
import { UserEntity } from './UserEntity';

export class AuthenticatedUserEntity {
    public accessToken!: string;

    @Type(() => UserEntity)
    public user!: UserEntity;
}

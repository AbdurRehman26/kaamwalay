import { Field } from '../decorators/Field';
import { UserEntity } from './UserEntity';

export class AuthenticatedUserEntity {
    @Field()
    public user!: UserEntity;

    @Field('access_token')
    public accessToken!: string;
}

import { Injectable } from '@shared/decorators/Injectable';
import { Repository } from '@shared/repositories/Repository';
import { UserEntity } from '@shared/entities/UserEntity';
import { UpdateUserProfileDTO } from '@shared/dto/UpdateUserProfileDTO';
import { ChangeUserPasswordDTO } from '@shared/dto/ChangeUserPasswordDTO';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';

@Injectable('UserRepository')
export class UserRepository extends Repository<UserEntity> {
    readonly endpointPath: string = '';
    readonly model = UserEntity;

    public async updateUserProfile(input: UpdateUserProfileDTO) {
        const { data } = await this.endpoint.put('/customer/profile', input);
        return this.toEntity(data);
    }

    public async confirmPasswordWithAGS(input: LoginRequestDto) {
        const { data } = await this.endpoint.post('/auth/login/ags', input);
        return data;
    }

    public async updateUserPassword(input: ChangeUserPasswordDTO) {
        const { data } = await this.endpoint.post('auth/password/change', input);
        return data;
    }
}

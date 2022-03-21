import { Injectable } from '@shared/decorators/Injectable';
import { ChangeUserPasswordDTO } from '@shared/dto/ChangeUserPasswordDTO';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { UpdateUserProfileDTO } from '@shared/dto/UpdateUserProfileDTO';
import { UserEntity } from '@shared/entities/UserEntity';
import { Repository } from '@shared/repositories/Repository';

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

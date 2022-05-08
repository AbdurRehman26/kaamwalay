import { AxiosRequestConfig } from 'axios';
import { Injectable } from '@shared/decorators/Injectable';
import { ChangeUserPasswordDto } from '@shared/dto/ChangeUserPasswordDto';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { UpdateUserProfileDto } from '@shared/dto/UpdateUserProfileDto';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { AddressStateEntity } from '@shared/entities/AddressStateEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { Repository } from '@shared/repositories/Repository';

@Injectable('UserRepository')
export class UserRepository extends Repository<UserEntity> {
    readonly endpointPath: string = '';
    readonly model = UserEntity;

    public async updateUserProfile(input: UpdateUserProfileDto) {
        const { data } = await this.endpoint.put('/customer/profile', input);

        return this.toEntity(data);
    }

    public async confirmPasswordWithAGS(input: LoginRequestDto) {
        const { data } = await this.endpoint.post('/auth/login/ags', input);

        return data;
    }

    public async updateUserPassword(input: ChangeUserPasswordDto) {
        const { data } = await this.endpoint.post('auth/password/change', input);

        return data;
    }

    public async getAddresses(config?: AxiosRequestConfig): Promise<AddressEntity[]> {
        const { data } = await this.endpoint.get('/customer/addresses', config);

        return this.toEntities(data, null, AddressEntity);
    }

    public async getAddressStates(config?: AxiosRequestConfig): Promise<AddressStateEntity[]> {
        const { data } = await this.endpoint.get('/customer/addresses/states', config);

        return this.toEntities(data, null, AddressStateEntity);
    }

    async deactivateAccount(): Promise<{ success: boolean }> {
        const { data } = await this.endpoint.post('/customer/account/deactivate');

        return data;
    }

    async deleteAccount(): Promise<{ success: boolean }> {
        const { data } = await this.endpoint.post('/customer/account/delete');

        return data;
    }
}

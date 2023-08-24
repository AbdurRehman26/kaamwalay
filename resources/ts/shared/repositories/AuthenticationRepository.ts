import { instanceToPlain, plainToInstance } from 'class-transformer';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { Inject } from '../decorators/Inject';
import { Injectable } from '../decorators/Injectable';
import { ValidateMethodParamsAsync } from '../decorators/ValidateMethodParams';
import { LoginRequestDto } from '../dto/LoginRequestDto';
import { ResetPasswordRequestDto } from '../dto/ResetPasswordRequestDto';
import { SignUpRequestDto } from '../dto/SignUpRequestDto';
import { AuthenticatedUserEntity } from '../entities/AuthenticatedUserEntity';
import { UserEntity } from '../entities/UserEntity';
import { toApiPropertiesObject } from '../lib/utils/toApiPropertiesObject';
import { AuthenticationService } from '../services/AuthenticationService';
import { Repository } from './Repository';

@Injectable('AuthenticationRepository')
export class AuthenticationRepository extends Repository<AuthenticatedUserEntity> {
    readonly endpointPath: string = '/auth';
    readonly model = AuthenticatedUserEntity;
    endpointConfig = {
        version: 'v2',
    };
    constructor(@Inject() public authenticationService: AuthenticationService) {
        super();
    }

    @ValidateMethodParamsAsync()
    public async postLogin(input: LoginRequestDto) {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint('/auth/login', { version: 'v2' });

        const { data } = await endpoint.post('', input);
        return plainToInstance(AuthenticatedUserEntity, data);
    }

    @ValidateMethodParamsAsync()
    public async postRegister(input: SignUpRequestDto) {
        this.endpointConfig = {
            version: 'v3',
        };

        const { fullName, ...rest } = input;
        const { data } = await this.endpoint.post(
            '/register',
            toApiPropertiesObject({ ...rest, ...this.parseName(fullName) }),
        );
        return plainToInstance(AuthenticatedUserEntity, data);
    }

    public async whoami() {
        this.endpointConfig = {
            version: 'v3',
        };

        const { data } = await this.endpoint.get('/me');
        return plainToInstance(UserEntity, data.user);
    }

    public async forgotPassword(email: string) {
        const { data } = await this.endpoint.post<{ message: string }>('/password/forgot', { email });
        return data;
    }

    @ValidateMethodParamsAsync()
    public async resetPassword(input: ResetPasswordRequestDto) {
        const { data } = await this.endpoint.post<{ message: string }>('/password/reset', instanceToPlain(input));
        return data;
    }

    private parseName(fullName: string) {
        const value = fullName.trim();
        const firstSpace = value.indexOf(' ');
        if (firstSpace === -1) {
            return { firstName: value, lastName: null };
        }

        const firstName = value.slice(0, firstSpace);
        const lastName = value.slice(firstSpace + 1);

        return { firstName, lastName };
    }
}

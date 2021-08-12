import { plainToClass } from 'class-transformer';

import { Inject } from '@shared/decorators/Inject';
import { Injectable } from '@shared/decorators/Injectable';
import { ValidateMethodParamsAsync } from '@shared/decorators/ValidateMethodParams';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { AuthenticatedUserEntity } from '@shared/entities/AuthenticatedUserEntity';
import { CustomerOrdersPaymentPlanEntity } from '@shared/entities/CustomerOrdersPaymentPlanEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { AuthenticationService } from '@shared/services/AuthenticationService';

import { SignUpRequestDto } from '../dto/SignUpRequestDto';
import { Repository } from './Repository';

@Injectable('AuthenticationRepository')
export class AuthenticationRepository extends Repository<CustomerOrdersPaymentPlanEntity> {
    readonly endpointPath: string = '/auth';
    readonly model = CustomerOrdersPaymentPlanEntity;

    constructor(@Inject() public authenticationService: AuthenticationService) {
        super();
    }

    @ValidateMethodParamsAsync()
    public async postLogin(input: LoginRequestDto) {
        const { data } = await this.endpoint.post('/login', input);
        return plainToClass(AuthenticatedUserEntity, data);
    }

    @ValidateMethodParamsAsync()
    public async postRegister(input: SignUpRequestDto) {
        const { fullName, ...rest } = input;
        const { data } = await this.endpoint.post(
            '/register',
            toApiPropertiesObject({ ...rest, ...this.parseName(fullName) }),
        );
        return plainToClass(AuthenticatedUserEntity, data);
    }

    public async whoami() {
        const { data } = await this.endpoint.get('/me');
        return plainToClass(UserEntity, data.user);
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

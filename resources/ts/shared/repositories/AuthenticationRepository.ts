import { plainToClass } from 'class-transformer';

import { Inject } from '@shared/decorators/Inject';
import { Injectable } from '@shared/decorators/Injectable';
import { ValidateMethodParamsAsync } from '@shared/decorators/ValidateMethodParams';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { AuthenticatedUserEntity } from '@shared/entities/AuthenticatedUserEntity';
import { CustomerOrdersPaymentPlanEntity } from '@shared/entities/CustomerOrdersPaymentPlanEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { AuthenticationService } from '@shared/services/AuthenticationService';

import { Repository } from './Repository';

@Injectable()
export class AuthenticationRepository extends Repository<CustomerOrdersPaymentPlanEntity> {
    readonly endpointPath: string = '/auth';
    readonly model = CustomerOrdersPaymentPlanEntity;

    constructor(@Inject() public authenticationService: AuthenticationService) {
        super();
    }

    @ValidateMethodParamsAsync()
    public async postLogin(loginRequest: LoginRequestDto) {
        const { data } = await this.endpoint.post('/login', loginRequest);
        return plainToClass(AuthenticatedUserEntity, data);
    }

    public async whoami() {
        const { data } = await this.endpoint.get('/me');
        return plainToClass(UserEntity, data.user);
    }
}

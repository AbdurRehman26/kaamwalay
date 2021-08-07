import { plainToClass } from 'class-transformer';

import { Injectable } from '@shared/decorators/Injectable';
import { ValidateMethodParamsAsync } from '@shared/decorators/ValidateMethodParams';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { AuthenticatedUserEntity } from '@shared/entities/AuthenticatedUserEntity';
import { CustomerOrdersPaymentPlanEntity } from '@shared/entities/CustomerOrdersPaymentPlanEntity';

import { Repository } from './Repository';

@Injectable()
export class AuthenticationRepository extends Repository<CustomerOrdersPaymentPlanEntity> {
    readonly endpointPath: string = '/';
    readonly model = CustomerOrdersPaymentPlanEntity;

    @ValidateMethodParamsAsync()
    public async postLogin(loginRequest: LoginRequestDto) {
        const { data } = await this.endpoint.post('/login', loginRequest);
        return plainToClass(AuthenticatedUserEntity, data);
    }
}

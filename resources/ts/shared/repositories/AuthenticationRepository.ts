import { Injectable } from '@shared/decorators/Injectable';
import { ValidateMethodParamsAsync } from '@shared/decorators/ValidateMethodParams';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { CustomerOrdersPaymentPlanEntity } from '@shared/entities/CustomerOrdersPaymentPlanEntity';

import { Repository } from './Repository';

@Injectable()
export class AuthenticationRepository extends Repository<CustomerOrdersPaymentPlanEntity> {
    readonly endpointPath: string = '/';
    readonly model = CustomerOrdersPaymentPlanEntity;

    @ValidateMethodParamsAsync()
    public async sendLoginRequest(loginRequest: LoginRequestDto) {
        console.log({ loginRequest });
    }
}

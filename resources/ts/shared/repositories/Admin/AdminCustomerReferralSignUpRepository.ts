import { Injectable } from '@shared/decorators/Injectable';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('AdminCustomerReferralSignUpRepository')
export class AdminCustomerReferralSignUpRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'admin/customer/:customerId/referral/sign-ups';
    readonly model = CustomerEntity;
    readonly endpointConfig = {
        version: 'v3',
    };
}

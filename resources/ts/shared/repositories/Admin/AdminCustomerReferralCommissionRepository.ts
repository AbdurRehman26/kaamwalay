import { Injectable } from '@shared/decorators/Injectable';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('AdminCustomerReferralCommissionRepository')
export class AdminCustomerReferralCommissionRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'admin/customer/:customerId/referral/commission-earnings';
    readonly model = CustomerEntity;
    readonly endpointConfig = {
        version: 'v3',
    };

    public async getCustomerReferrals() {
        const { data } = await this.endpoint.get('/');
        return this.toEntity(data);
    }

    public async getCustomerReferralSignUp() {
        const { data } = await this.endpoint.get('/');
        return this.toEntity(data);
    }
}

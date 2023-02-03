import { Injectable } from '@shared/decorators/Injectable';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('AdminCustomerReferralRepository')
export class AdminCustomerReferralRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'v3/admin/referral/:user_id/sign-ups';
    readonly model = CustomerEntity;

    // const { data } = await this.endpoint.post(`${userId}/assign-salesman/${salesmanId}`);
    // for reference how to use single repository for multiple get calls
    public async getCustomerReferrals() {
        const { data } = await this.endpoint.get('/');
        return this.toEntity(data);
    }

    public async getCustomerReferralSignUp() {
        const { data } = await this.endpoint.get('/');
        return this.toEntity(data);
    }
}

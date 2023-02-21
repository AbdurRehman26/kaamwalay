import { Injectable } from '@shared/decorators/Injectable';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { Repository } from '../Repository';

@Injectable('AdminReferralPayoutsRepository')
export class AdminReferralPayoutsRepository extends Repository<PayoutEntity> {
    readonly endpointPath: string = 'admin/referral-program/payouts';
    readonly model = PayoutEntity;
    readonly endpointConfig = {
        version: 'v3',
    };

    async payReferralCommissions() {
        const { data } = await this.endpoint.post(``);
        return data;
    }
}

import { Injectable } from '@shared/decorators/Injectable';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { Repository } from '../Repository';

@Injectable('AdminCustomerReferralPayoutRepository')
export class AdminCustomerReferralPayoutRepository extends Repository<PayoutEntity> {
    readonly endpointPath: string = 'admin/customer/:customerId/referral/payouts';
    readonly model = PayoutEntity;
    readonly endpointConfig = {
        version: 'v3',
    };
}

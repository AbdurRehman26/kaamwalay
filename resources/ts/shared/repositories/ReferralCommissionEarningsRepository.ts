import { ReferralCommissionEarningsEntity } from '@shared/entities/ReferralCommissionEarningsEntity';
import { Injectable } from '../decorators/Injectable';
import { Repository } from './Repository';

@Injectable('ReferralCommissionEarningsRepository')
export class ReferralCommissionEarningsRepository extends Repository<ReferralCommissionEarningsEntity> {
    readonly endpointPath: string = 'customer/referral/commission-earnings';
    readonly model = ReferralCommissionEarningsEntity;
    readonly endpointConfig = {
        version: 'v3',
    };
}

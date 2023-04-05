import { ReferralWithdrawEntity } from '@shared/entities/ReferralWithdrawEntity';
import { Injectable } from '../decorators/Injectable';
import { Repository } from './Repository';

@Injectable('ReferralWithdrawRepository')
export class ReferralWithdrawRepository extends Repository<ReferralWithdrawEntity> {
    readonly endpointPath: string = 'customer/referrer/payouts';
    readonly model = ReferralWithdrawEntity;
    readonly endpointConfig = {
        version: 'v3',
    };
}

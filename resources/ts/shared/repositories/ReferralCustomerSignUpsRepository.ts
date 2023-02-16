import { ReferralCustomerSignUpsEntity } from '@shared/entities/ReferralCustomerSignUpsEntity';
import { Injectable } from '../decorators/Injectable';
import { Repository } from './Repository';

@Injectable('ReferralCustomerSignUpsRepository')
export class ReferralCustomerSignUpsRepository extends Repository<ReferralCustomerSignUpsEntity> {
    readonly endpointPath: string = 'customer/referral/sign-ups';
    readonly model = ReferralCustomerSignUpsEntity;
    readonly endpointConfig = {
        version: 'v3',
    };
}

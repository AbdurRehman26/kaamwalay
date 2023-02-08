import { ReferrerEntity } from '@shared/entities/ReferrerEntity';
import { Injectable } from '../decorators/Injectable';
import { Repository } from './Repository';

@Injectable('ReferralRepository')
export class ReferralRepository extends Repository<ReferrerEntity> {
    readonly endpointPath: string = 'customer/referral/sign-ups';
    readonly model = ReferrerEntity;
    readonly endpointConfig = {
        version: 'v3',
    };
}

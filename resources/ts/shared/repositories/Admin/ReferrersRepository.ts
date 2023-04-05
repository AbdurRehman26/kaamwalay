import { Injectable } from '../../decorators/Injectable';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('ReferrersRepository')
export class ReferrersRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'admin/referral-program/referrers';
    readonly model = CustomerEntity;

    readonly endpointConfig = {
        version: 'v3',
    };
}

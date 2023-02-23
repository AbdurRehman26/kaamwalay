import { Injectable } from '../../decorators/Injectable';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('RefereesRepository')
export class RefereesRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'admin/referral-program/referees';
    readonly model = CustomerEntity;

    readonly endpointConfig = {
        version: 'v3',
    };
}

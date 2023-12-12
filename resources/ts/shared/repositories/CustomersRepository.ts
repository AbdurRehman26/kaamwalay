import { Injectable } from '../decorators/Injectable';
import { CustomerEntity } from '../entities/CustomerEntity';
import { Repository } from './Repository';

@Injectable('CustomersRepository')
export class CustomersRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = '/customer';
    readonly model = CustomerEntity;
    readonly endpointConfig = {
        version: 'v3',
    };
}

import { Injectable } from '../../decorators/Injectable';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('CustomerRepository')
export class CustomerRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'admin/customers/:id';
    readonly model = CustomerEntity;
}

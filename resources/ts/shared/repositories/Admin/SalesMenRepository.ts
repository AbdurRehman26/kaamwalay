import { Injectable } from '../../decorators/Injectable';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('AdminSalesMenRepository')
export class SalesMenRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'admin/salesmen';
    readonly model = CustomerEntity;
}

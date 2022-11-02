import { AddCustomerRequestDto } from '@shared/dto/AddCustomerRequestDto';
import { Injectable } from '../../decorators/Injectable';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('AdminCustomersRepository')
export class CustomersRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'admin/customers';
    readonly model = CustomerEntity;

    public async storeCustomer(input: AddCustomerRequestDto) {
        const { data } = await this.endpoint.post('', input);
        return this.toEntity(data);
    }

    public async assignSalesMan(userId: number, salesmanId: number) {
        const { data } = await this.endpoint.post(`${userId}/assign-salesman/${salesmanId}`);
        return data;
    }
}

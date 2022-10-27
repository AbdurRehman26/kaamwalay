import { AddSalesRepRequestDto } from '@shared/dto/AddSalesRepRequestDto';
import { Injectable } from '../../decorators/Injectable';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { Repository } from '../Repository';

@Injectable('AdminSalesMenRepository')
export class SalesRepRepository extends Repository<CustomerEntity> {
    readonly endpointPath: string = 'admin/salesmen';
    readonly model = CustomerEntity;

    public async storeSalesRep(input: AddSalesRepRequestDto) {
        const { data } = await this.endpoint.post('', input);
        return this.toEntity(data);
    }

    public async getSalesRep() {
        const { data } = await this.endpoint.get('');
        return data;
    }
}

import { AddSalesRepRequestDto } from '@shared/dto/AddSalesRepRequestDto';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { Injectable } from '../../decorators/Injectable';
import { Repository } from '../Repository';

@Injectable('AdminSalesMenRepository')
export class SalesRepRepository extends Repository<SalesRepEntity> {
    readonly endpointPath: string = 'admin/salesmen';
    readonly model = SalesRepEntity;

    public async storeSalesRep(input: AddSalesRepRequestDto) {
        const { data } = await this.endpoint.post('', input);
        return this.toEntity(data);
    }

    public async getSalesRep() {
        const { data } = await this.endpoint.get('');
        return this.toEntity(data);
    }
}

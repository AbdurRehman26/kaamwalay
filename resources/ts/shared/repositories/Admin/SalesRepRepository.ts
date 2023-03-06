import { AddSalesRepRequestDto } from '@shared/dto/AddSalesRepRequestDto';
import { UpdateSalesRepRequestDto } from '@shared/dto/UpdateSalesRepRequestDto';
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

    public async getSalesReps() {
        const { data } = await this.endpoint.get('/');
        return this.toEntity(data);
    }

    public async updateSalesRep(id: number, input: UpdateSalesRepRequestDto) {
        const { data } = await this.endpoint.put('/' + id, input);
        return this.toEntity(data);
    }
}

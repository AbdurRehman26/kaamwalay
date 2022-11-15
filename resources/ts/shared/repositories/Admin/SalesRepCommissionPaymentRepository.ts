import { AddCommissionPaymentDto } from '@shared/dto/AddCommissionPaymentDto';
import { SalesRepCommissionPaymentsEntity } from '@shared/entities/SalesRepCommissionPaymentsEntity';
import { Injectable } from '../../decorators/Injectable';
import { Repository } from '../Repository';

@Injectable('AdminSalesMenRepository')
export class SalesRepCommissionPaymentsRepository extends Repository<SalesRepCommissionPaymentsEntity> {
    readonly endpointPath: string = 'admin/salesmen/:salesmanId/commission-payments';
    readonly model = SalesRepCommissionPaymentsEntity;

    public async storeCommission(input: AddCommissionPaymentDto) {
        const { data } = await this.endpoint.post('', input);
        return this.toEntity(data);
    }
}

import { AddCommissionPaymentDto } from '@shared/dto/AddCommissionPaymentDto';
import { SalesRepCommissionPaymentsEntity } from '@shared/entities/SalesRepCommissionPaymentsEntity';
import { Injectable } from '../../decorators/Injectable';
import { Repository } from '../Repository';

@Injectable('AdminSalesRepCommissionPaymentRepository')
export class AdminSalesRepCommissionPaymentRepository extends Repository<SalesRepCommissionPaymentsEntity> {
    readonly endpointPath: string = 'admin/salesmen/:salesmanId/commission-payments';
    readonly model = SalesRepCommissionPaymentsEntity;

    public async storeCommission(input: AddCommissionPaymentDto) {
        const { data } = await this.endpoint.post('', input, {
            params: {
                salesmanId: input.salesmanId,
            },
        });
        return this.toEntity(data);
    }
}

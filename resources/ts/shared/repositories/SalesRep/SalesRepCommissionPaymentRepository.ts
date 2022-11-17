import { SalesRepCommissionPaymentsEntity } from '@shared/entities/SalesRepCommissionPaymentsEntity';
import { Injectable } from '../../decorators/Injectable';
import { Repository } from '../Repository';

@Injectable('SalesRepCommissionPaymentsRepository')
export class SalesRepCommissionPaymentsRepository extends Repository<SalesRepCommissionPaymentsEntity> {
    readonly endpointPath: string = 'salesman/commission-payments';
    readonly model = SalesRepCommissionPaymentsEntity;
}

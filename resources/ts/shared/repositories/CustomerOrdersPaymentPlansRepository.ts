import { Injectable } from '@shared/decorators/Injectable';
import { CustomerOrdersPaymentPlanEntity } from '@shared/entities/CustomerOrdersPaymentPlanEntity';

import { Repository } from './Repository';

@Injectable()
export class CustomerOrdersPaymentPlansRepository extends Repository<CustomerOrdersPaymentPlanEntity> {
    readonly endpointPath: string = 'customer/orders/payment-plans';
    readonly model = CustomerOrdersPaymentPlanEntity;
}

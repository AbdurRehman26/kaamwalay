import { Injectable } from '../decorators/Injectable';
import { PaymentPlanEntity } from '../entities/PaymentPlanEntity';
import { Repository } from './Repository';

@Injectable('OrdersPaymentPlansRepository')
export class PaymentPlansRepository extends Repository<PaymentPlanEntity> {
    readonly endpointPath: string = 'customer/orders/payment-plans';
    readonly model = PaymentPlanEntity;
}

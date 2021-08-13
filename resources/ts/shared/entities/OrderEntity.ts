import { Type } from 'class-transformer';
import { Moment } from 'moment';

import { Entity } from '@shared/entities/Entity';

import { DateField } from '../decorators/DateField';
import { Field } from '../decorators/Field';
import { AddressEntity } from './AddressEntity';
import { OrderItemEntity } from './OrderItemEntity';
import { OrderPaymentEntity } from './OrderPaymentEntity';
import { PaymentMethodEntity } from './PaymentMethodEntity';
import { PaymentPlanEntity } from './PaymentPlanEntity';
import { ShippingMethodEntity } from './ShippingMethodEntity';
import { UserEntity } from './UserEntity';

export class OrderEntity extends Entity {
    public status!: string;

    @Type()
    public customer!: UserEntity;

    @Field('order_items', () => OrderItemEntity)
    public orderItems!: OrderItemEntity[];

    @Field('order_number')
    public orderNumber!: string;

    @Field('number_of_cards')
    public numberOfCards!: number;

    @Field('total_declared_value')
    public totalDeclaredValue!: number;

    @Field('grand_total')
    public grandTotal!: number;

    @Field('shipping_fee')
    public shippingFee!: number;

    @Field('service_fee')
    public serviceFee!: number;

    @Field('payment_plan', { type: () => PaymentPlanEntity })
    public paymentPlan!: PaymentPlanEntity;

    @Field('payment_method')
    public paymentMethod!: PaymentMethodEntity;

    @Field('shipping_method')
    public shippingMethod!: ShippingMethodEntity;

    @Field('order_payment')
    public orderPayment!: OrderPaymentEntity;

    @Field('shipping_address')
    public shippingAddress!: AddressEntity;

    @Field('billing_address')
    public billingAddress!: AddressEntity;

    @DateField('arrived_at')
    public arrivedAt!: Moment;
}

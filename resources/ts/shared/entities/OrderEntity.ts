import { Type } from 'class-transformer';
import { Moment } from 'moment';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { CustomerShipmentEntity } from '@shared/entities/CustomerShipmentEntity';
import { Entity } from '@shared/entities/Entity';
import { DateField } from '../decorators/DateField';
import { Field } from '../decorators/Field';
import { AddressEntity } from './AddressEntity';
import { InvoiceEntity } from './InvoiceEntity';
import { OrderItemEntity } from './OrderItemEntity';
import { OrderPaymentEntity } from './OrderPaymentEntity';
import { OrderStatusEntity } from './OrderStatusEntity';
import { PaymentMethodEntity } from './PaymentMethodEntity';
import { PaymentPlanEntity } from './PaymentPlanEntity';
import { ShippingMethodEntity } from './ShippingMethodEntity';
import { UserEntity } from './UserEntity';

export class OrderEntity extends Entity {
    @Field('order_status')
    public orderStatus!: OrderStatusEntity;

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

    @Field('customer_shipment')
    public customerShipment!: CustomerShipmentEntity | null;

    @DateField('arrived_at')
    public arrivedAt!: Moment;

    @Type(() => InvoiceEntity)
    public invoice!: InvoiceEntity | null;

    @Field('customer_id')
    public customerId!: number;

    @Field('customer_number')
    public customerNumber!: string;

    public get status() {
        return this.orderStatus?.name;
    }

    public getItemsByStatus(status: OrderItemStatusEnum): OrderItemEntity[] {
        return this.orderItems.filter((item) => item.status?.id === status);
    }
}

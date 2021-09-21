import { Type } from 'class-transformer';
import { Moment } from 'moment';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { Entity } from '@shared/entities/Entity';
import { DateField } from '../decorators/DateField';
import { Field } from '../decorators/Field';
import { AddressEntity } from './AddressEntity';
import { InvoiceEntity } from './InvoiceEntity';
import { OrderItemEntity } from './OrderItemEntity';
import { OrderPaymentEntity } from './OrderPaymentEntity';
import { OrderStatusEntity } from './OrderStatusEntity';
import { OrderStatusHistoryEntity } from './OrderStatusHistoryEntity';
import { PaymentMethodEntity } from './PaymentMethodEntity';
import { PaymentPlanEntity } from './PaymentPlanEntity';
import { ShipmentEntity } from './ShipmentEntity';
import { ShippingMethodEntity } from './ShippingMethodEntity';
import { UserEntity } from './UserEntity';

export class OrderEntity extends Entity {
    @Field('order_status')
    public orderStatus!: OrderStatusEntity;
    @Field('order_status_history', () => OrderStatusHistoryEntity)
    public orderStatusHistory!: OrderStatusHistoryEntity[];

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

    @Field('payment_plan', () => PaymentPlanEntity)
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

    @Field('customer_shipment', () => ShipmentEntity)
    public customerShipment!: ShipmentEntity | null;

    @Type(() => ShipmentEntity)
    public shipment!: ShipmentEntity | null;

    @DateField('arrived_at')
    public arrivedAt!: Moment;

    @Type(() => InvoiceEntity)
    public invoice!: InvoiceEntity | null;

    @Field('customer_id')
    public customerId!: number;

    @Field('customer_number')
    public customerNumber!: string;

    @Field('reviewed_at')
    public reviewedAt!: string;

    @Field('reviewed_by')
    public reviewedBy!: string;

    @Field('notes')
    public notes!: string;

    public get status() {
        return this.orderStatus?.code;
    }

    public getItemsByStatus(status: OrderItemStatusEnum): OrderItemEntity[] {
        return (this.orderItems ?? []).filter((item: any) => item.status?.order_item_status?.id === status);
    }

    public hasOrderStatus(status: OrderStatusEnum, checkInHistory: boolean = true) {
        const matchCurrentStatus = this.orderStatus?.id === status;
        if (!matchCurrentStatus && checkInHistory) {
            const filteredOrderStatusHistory = (this.orderStatusHistory || []).filter(
                ({ orderStatus }) => orderStatus.id === status,
            );
            return filteredOrderStatusHistory.length > 0;
        }

        return matchCurrentStatus;
    }

    public addItem(orderItem: OrderItemEntity) {
        let added = false;

        this.orderItems = this.orderItems.map((item) => {
            if (item.id === orderItem.id) {
                added = true;
                return orderItem;
            }

            return item;
        });

        if (!added) {
            this.orderItems.push(orderItem);
        }

        return this;
    }
}

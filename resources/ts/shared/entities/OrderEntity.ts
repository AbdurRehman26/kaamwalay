import { Type } from 'class-transformer';
import { Moment } from 'moment';
import { OrderExtraChargeEntity } from '@shared/entities/OrderExtraChargeEntity';
import { OrderRefundEntity } from '@shared/entities/OrderRefundEntity';
import { OrderItemStatusEnum } from '../constants/OrderItemStatusEnum';
import { OrderStatusEnum } from '../constants/OrderStatusEnum';
import { DateField } from '../decorators/DateField';
import { AddressEntity } from './AddressEntity';
import { Entity } from './Entity';
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
    public orderNumber!: string;
    public numberOfCards!: number;
    public totalDeclaredValue!: number;
    public grandTotal!: number;
    public shippingFee!: number;
    public serviceFee!: number;
    public customerId!: number;
    public customerNumber!: string;
    public reviewedAt!: string;
    public reviewedBy!: string;
    public notes!: string;

    @Type(() => OrderStatusEntity)
    public orderStatus!: OrderStatusEntity;

    @Type(() => UserEntity)
    public customer!: UserEntity;

    @Type(() => PaymentPlanEntity)
    public paymentPlan!: PaymentPlanEntity;

    @Type(() => PaymentMethodEntity)
    public paymentMethod!: PaymentMethodEntity;

    @Type(() => OrderExtraChargeEntity)
    public extraCharges!: OrderExtraChargeEntity[];

    @Type(() => OrderRefundEntity)
    public refunds!: OrderRefundEntity[];

    @Type(() => ShippingMethodEntity)
    public shippingMethod!: ShippingMethodEntity;

    @Type(() => OrderPaymentEntity)
    public orderPayment!: OrderPaymentEntity;

    @Type(() => AddressEntity)
    public shippingAddress!: AddressEntity;

    @Type(() => AddressEntity)
    public billingAddress!: AddressEntity;

    @Type(() => OrderStatusHistoryEntity)
    public orderStatusHistory!: OrderStatusHistoryEntity[];

    @Type(() => OrderItemEntity)
    public orderItems!: OrderItemEntity[];

    @Type(() => ShipmentEntity)
    public orderCustomerShipment!: ShipmentEntity | null;

    @Type(() => ShipmentEntity)
    public orderShipment!: ShipmentEntity | null;

    @DateField()
    public arrivedAt!: Moment;

    @Type(() => InvoiceEntity)
    public invoice!: InvoiceEntity | null;

    public get status() {
        return this.orderStatus?.code;
    }

    public getRefundsTotal() {
        const refunds = this.refunds === undefined ? [] : this.refunds;
        return refunds.reduce((n, { amount }) => n + Number(amount), 0);
    }

    public getExtraChargesTotal() {
        const extraCharges = this.extraCharges === undefined ? [] : this.extraCharges;
        return extraCharges.reduce((n, { amount }) => n + Number(amount), 0);
    }

    public getItemsByStatus(status: OrderItemStatusEnum): OrderItemEntity[] {
        return (this.orderItems ?? []).filter((item: any) => item.status?.orderItemStatus?.id === status);
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

import { Type } from 'class-transformer';
import { PaymentStatusEnum } from '@shared/constants/PaymentStatusEnum';
import { OrderCouponEntity } from '@shared/entities/OrderCouponEntity';
import { OrderExtraChargeEntity } from '@shared/entities/OrderExtraChargeEntity';
import { OrderRefundEntity } from '@shared/entities/OrderRefundEntity';
import { OrderItemStatusEnum } from '../constants/OrderItemStatusEnum';
import { OrderStatusEnum } from '../constants/OrderStatusEnum';
import { DateField } from '../decorators/DateField';
import { AddressEntity } from './AddressEntity';
import { Entity } from './Entity';
import { InvoiceEntity } from './InvoiceEntity';
import { OrderItemEntity } from './OrderItemEntity';
import { OrderLabelEntity } from './OrderLabelEntity';
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
    public discountedAmount!: string;
    public grandTotal!: number;
    public extraChargeTotal!: number;
    public refundTotal!: number;
    public shippingFee!: number;
    public serviceFee!: number;
    public customerId!: number;
    public orderStep!: string;
    public customerNumber!: string;
    public reviewedAt!: string;
    public reviewedBy!: string;
    public notes!: string;
    public paymentMethodId!: number;
    public paymentMethodDiscountedAmount!: string;
    public amountPaidFromWallet!: string;
    public paymentStatus!: PaymentStatusEnum;

    @Type(() => OrderCouponEntity)
    public coupon!: OrderCouponEntity;

    @Type(() => OrderStatusEntity)
    public orderStatus!: OrderStatusEntity;

    @Type(() => UserEntity)
    public customer!: UserEntity;

    @Type(() => PaymentPlanEntity)
    public paymentPlan!: PaymentPlanEntity;

    @Type(() => PaymentMethodEntity)
    public paymentMethod!: PaymentMethodEntity;

    @Type(() => PaymentPlanEntity)
    public originalPaymentPlan!: PaymentPlanEntity;

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
    public arrivedAt!: Date;

    @Type(() => InvoiceEntity)
    public invoice!: InvoiceEntity | null;

    @Type(() => OrderLabelEntity)
    public orderLabel!: OrderLabelEntity | null;

    public get status() {
        return this.orderStatus?.code;
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

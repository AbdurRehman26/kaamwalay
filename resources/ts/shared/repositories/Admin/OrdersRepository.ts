import { plainToInstance } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { AddCardToOrderDto } from '@shared/dto/AddCardToOrderDto';
import { EditCardOfOrderDto } from '@shared/dto/EditCardOfOrderDto';
import { EditTransactionNotesDto } from '@shared/dto/EditTransactionNotesDto';
import { RefundOrderTransactionDto } from '@shared/dto/RefundOrderTransactionDto';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderExtraChargeEntity } from '@shared/entities/OrderExtraChargeEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { OrderRefundEntity } from '@shared/entities/OrderRefundEntity';
import { AddExtraChargeToOrderDto } from '../../dto/AddExtraChargeToOrderDto';
import { AddOrderStatusHistoryDto } from '../../dto/AddOrderStatusHistoryDto';
import { ChangeOrderShipmentDto } from '../../dto/ChangeOrderShipmentDto';
import { OrderStatusHistoryEntity } from '../../entities/OrderStatusHistoryEntity';
import { ShipmentEntity } from '../../entities/ShipmentEntity';
import { toApiPropertiesObject } from '../../lib/utils/toApiPropertiesObject';
import { Repository } from '../Repository';

@Injectable('AdminOrdersRepository')
export class OrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'admin/orders/:orderId';
    readonly model = OrderEntity;
    endpointConfig = { version: 'v3' };

    async addOrderStatusHistory(input: AddOrderStatusHistoryDto): Promise<OrderStatusHistoryEntity> {
        const { orderId, orderStatusId } = input;
        this.endpointConfig = { version: 'v2' };

        const { data } = await this.endpoint.post('/status-history', toApiPropertiesObject({ orderStatusId }), {
            params: {
                orderId,
                include: ['orderStatus'],
            },
        });

        return plainToInstance(OrderStatusHistoryEntity, data);
    }

    async addCard(input: AddCardToOrderDto) {
        this.endpointConfig = { version: 'v2' };

        const { orderId, cardProductId: cardId, value } = input;
        const body = toApiPropertiesObject({ cardId, value });
        const { data } = await this.endpoint.post('/items', body, { params: { orderId } });

        return plainToInstance(OrderItemEntity, data);
    }

    async editCard(input: EditCardOfOrderDto) {
        this.endpointConfig = { version: 'v2' };
        const { orderId, cardProductId: cardId, orderItemId, value } = input;
        const body = toApiPropertiesObject({ cardId, value });
        const { data } = await this.endpoint.put(`/items/:orderItemId`, body, { params: { orderItemId, orderId } });

        return plainToInstance(OrderItemEntity, data);
    }

    async addExtraChargeToOrder(input: AddExtraChargeToOrderDto) {
        this.endpointConfig = { version: 'v2' };
        const { notes, amount, orderId } = input;
        const body = toApiPropertiesObject({ notes, amount });
        const { data } = await this.endpoint.post(`${orderId}/payments/extra-charge`, body);

        return plainToInstance(OrderExtraChargeEntity, data);
    }

    async refundOrderTransaction(input: RefundOrderTransactionDto) {
        this.endpointConfig = { version: 'v2' };
        const { notes, amount, addToWallet, orderId } = input;
        const body = toApiPropertiesObject({ notes, amount, addToWallet });
        const { data } = await this.endpoint.post(`${orderId}/payments/refund`, body);
        return plainToInstance(OrderRefundEntity, data);
    }

    async markOrderAsPaid(input: { orderId: number }) {
        this.endpointConfig = { version: 'v2' };
        const { orderId } = input;
        const { data } = await this.endpoint.post(`${orderId}/mark-paid`);
        return plainToInstance(OrderEntity, data);
    }

    async markOrderAsAbandoned(input: { orderIds: number[] }) {
        const { orderIds } = input;
        this.endpointConfig.version = 'v3';
        const { data } = await this.endpoint.post(`mark-abandoned`, {
            items: orderIds,
        });
        return plainToInstance(OrderEntity, data);
    }

    async markOrderAsUnAbandoned(input: { orderIds: number[] }) {
        const { orderIds } = input;
        this.endpointConfig.version = 'v3';
        const { data } = await this.endpoint.post(`mark-un-abandoned`, {
            items: orderIds,
        });
        return plainToInstance(OrderEntity, data);
    }

    async editTransactionNotes(input: EditTransactionNotesDto) {
        this.endpointConfig = { version: 'v2' };
        const { orderId, transactionId, notes } = input;
        const body = toApiPropertiesObject({ notes });
        const { data } = await this.endpoint.put(`${orderId}/order-payments/${transactionId}`, body);

        return plainToInstance(OrderItemEntity, data);
    }

    public async setShipment(input: ChangeOrderShipmentDto) {
        this.endpointConfig = { version: 'v2' };
        const { orderId, shippingProvider, trackingNumber } = input;
        const { data } = await this.endpoint.post(
            'shipment',
            {
                shippingProvider,
                trackingNumber,
            },
            {
                params: {
                    orderId,
                },
            },
        );

        return plainToInstance(ShipmentEntity, data);
    }

    async cancelOrder(input: { orderId: number }) {
        this.endpointConfig = { version: 'v2' };
        const { orderId } = input;
        const { data } = await this.endpoint.delete(`/${orderId}`);
        return plainToInstance(OrderEntity, data);
    }

    async generateOrderLabel(input: { orderId: number }) {
        this.endpointConfig = { version: 'v2' };
        const { orderId } = input;
        const { data } = await this.endpoint.post(`/${orderId}/generate-label`);
        return plainToInstance(OrderEntity, data);
    }
}

import { plainToClass } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { AddCardToOrderDto } from '@shared/dto/AddCardToOrderDto';
import { AddExtraChargeToOrderDTO } from '@shared/dto/AddExtraChargeToOrderDTO';
import { EditCardOfOrderDto } from '@shared/dto/EditCardOfOrderDto';
import { EditTransactionNotesDTO } from '@shared/dto/EditTransactionNotesDTO';
import { RefundOrderTransactionDTO } from '@shared/dto/RefundOrderTransactionDTO';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderExtraChargeEntity } from '@shared/entities/OrderExtraChargeEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { OrderRefundEntity } from '@shared/entities/OrderRefundEntity';
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

    async addOrderStatusHistory(input: AddOrderStatusHistoryDto): Promise<OrderStatusHistoryEntity> {
        const { orderId, orderStatusId } = input;

        const { data } = await this.endpoint.post('/status-history', toApiPropertiesObject({ orderStatusId }), {
            params: {
                orderId,
                include: ['orderStatus'],
            },
        });

        return plainToClass(OrderStatusHistoryEntity, data);
    }

    async addCard(input: AddCardToOrderDto) {
        const { orderId, cardProductId: cardId, value } = input;
        const body = toApiPropertiesObject({ cardId, value });
        const { data } = await this.endpoint.post('/items', body, { params: { orderId } });

        return plainToClass(OrderItemEntity, data);
    }

    async editCard(input: EditCardOfOrderDto) {
        const { orderId, cardProductId: cardId, orderItemId, value } = input;
        const body = toApiPropertiesObject({ cardId, value });
        const { data } = await this.endpoint.put(`/items/:orderItemId`, body, { params: { orderItemId, orderId } });

        return plainToClass(OrderItemEntity, data);
    }

    async addExtraChargeToOrder(input: AddExtraChargeToOrderDTO) {
        const { notes, amount, orderId } = input;
        const body = toApiPropertiesObject({ notes, amount });
        const { data } = await this.endpoint.post(`${orderId}/extra/charge`, body);

        return plainToClass(OrderExtraChargeEntity, data);
    }

    async refundOrderTransaction(input: RefundOrderTransactionDTO) {
        const { notes, amount, orderId } = input;
        const body = toApiPropertiesObject({ notes, amount });
        const { data } = await this.endpoint.post(`${orderId}/refund`, body);

        return plainToClass(OrderRefundEntity, data);
    }

    async editTransactionNotes(input: EditTransactionNotesDTO) {
        const { orderId, transactionId, notes } = input;
        const body = toApiPropertiesObject({ notes });
        const { data } = await this.endpoint.put(`${orderId}/order-payments/${transactionId}`, body);

        return plainToClass(OrderItemEntity, data);
    }

    public async setShipment(input: ChangeOrderShipmentDto) {
        const { orderId, shippingProvider, trackingNumber } = input;
        const { data } = await this.endpoint.post(
            `shipment`,
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

        return plainToClass(ShipmentEntity, data);
    }
}

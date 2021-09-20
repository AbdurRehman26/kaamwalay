import { plainToClass } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { AddCardToOrderDto } from '@shared/dto/AddCardToOrderDto';
import { EditCardOfOrderDto } from '@shared/dto/EditCardOfOrderDto';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { AddOrderStatusHistoryDto } from '../../dto/AddOrderStatusHistoryDto';
import { OrderStatusHistoryEntity } from '../../entities/OrderStatusHistoryEntity';
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
}

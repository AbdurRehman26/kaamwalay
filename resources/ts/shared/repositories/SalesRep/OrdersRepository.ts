import { plainToInstance } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { AddCardToOrderDto } from '@shared/dto/AddCardToOrderDto';
import { EditCardOfOrderDto } from '@shared/dto/EditCardOfOrderDto';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { toApiPropertiesObject } from '../../lib/utils/toApiPropertiesObject';
import { Repository } from '../Repository';

@Injectable('SalesRepOrdersRepository')
export class OrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'salesman/orders/:orderId';
    readonly model = OrderEntity;

    async addCard(input: AddCardToOrderDto) {
        const { orderId, cardProductId: cardId, value } = input;
        const body = toApiPropertiesObject({ cardId, value });
        const { data } = await this.endpoint.post('/items', body, { params: { orderId } });

        return plainToInstance(OrderItemEntity, data);
    }

    async editCard(input: EditCardOfOrderDto) {
        const { orderId, cardProductId: cardId, orderItemId, value } = input;
        const body = toApiPropertiesObject({ cardId, value });
        const { data } = await this.endpoint.put(`/items/:orderItemId`, body, { params: { orderItemId, orderId } });

        return plainToInstance(OrderItemEntity, data);
    }
}

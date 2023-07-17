import { AxiosRequestConfig } from 'axios';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { AddCardToOrderDto } from '@shared/dto/AddCardToOrderDto';
import { EditCardOfOrderDto } from '@shared/dto/EditCardOfOrderDto';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { toApiPropertiesObject } from '../../lib/utils/toApiPropertiesObject';
import { Repository } from '../Repository';

@Injectable('SalesRepOrdersRepository')
export class OrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'salesman/orders/:orderId';
    readonly model = OrderEntity;

    public async getOrder(
        resourceId: any,
        config?: AxiosRequestConfig,
        transformModel?: ClassConstructor<OrderEntity>,
    ): Promise<OrderEntity> {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(this.endpointPath, {
            version: 'v3',
        });

        const { data } = await endpoint.get(`/${resourceId}`, config);

        return this.toEntity(data, null, transformModel);
    }

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

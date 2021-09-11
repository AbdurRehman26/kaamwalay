import { plainToClass } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { OrderEntity } from '@shared/entities/OrderEntity';
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
}

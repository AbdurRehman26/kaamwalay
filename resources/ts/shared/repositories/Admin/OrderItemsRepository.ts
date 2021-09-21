import { Injectable } from '../../decorators/Injectable';
import { ChangeOrderItemStatusBatchDto } from '../../dto/ChangeOrderItemStatusBatchDto';
import { ChangeOrderItemStatusDto } from '../../dto/ChangeOrderItemStatusDto';
import { OrderItemEntity } from '../../entities/OrderItemEntity';
import { Repository } from '../Repository';

@Injectable('OrderItemsRepository')
export class OrderItemsRepository extends Repository<OrderItemEntity> {
    readonly endpointPath: string = 'admin/orders/:orderId/items';
    readonly model = OrderItemEntity;

    public async changeOrderItemStatus(input: ChangeOrderItemStatusDto) {
        const { orderId, orderItemId, notes, orderItemStatus: status } = input;
        const { data } = await this.endpoint.post(
            `${orderItemId}/change-status`,
            { status, notes },
            {
                params: {
                    orderId,
                },
            },
        );

        return this.toEntity(data);
    }

    async changeOrderItemStatusBatch(input: ChangeOrderItemStatusBatchDto) {
        const { orderId, items, orderItemStatus: status } = input;
        const { data } = await this.endpoint.post(
            'bulk/change-status',
            { status, items },
            {
                params: {
                    orderId,
                },
            },
        );

        return this.toEntities(data);
    }
}

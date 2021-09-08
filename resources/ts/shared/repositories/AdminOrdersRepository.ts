import { Injectable } from '@shared/decorators/Injectable';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { Repository } from './Repository';

@Injectable('AdminOrdersRepository')
export class AdminOrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'admin/orders';
    readonly model = OrderEntity;
}

import { Injectable } from '../../decorators/Injectable';
import { OrderEntity } from '../../entities/OrderEntity';
import { Repository } from '../Repository';

@Injectable('AdminOrdersRepository')
export class OrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'admin/orders';
    readonly model = OrderEntity;
}

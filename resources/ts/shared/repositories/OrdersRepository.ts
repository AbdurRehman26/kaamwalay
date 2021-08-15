import { Injectable } from '@shared/decorators/Injectable';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { Repository } from './Repository';

@Injectable('OrdersRepository')
export class OrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'customer/orders';
    readonly model = OrderEntity;
}

import { OrdersRepository } from './OrdersRepository';

export class AdminOrdersRepository extends OrdersRepository {
    override endpointConfig = { version: 'v3' };
}

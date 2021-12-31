import { plainToInstance } from 'class-transformer';
import { Injectable } from '../decorators/Injectable';
import { ChangeOrderShipmentDto } from '../dto/ChangeOrderShipmentDto';
import { OrderEntity } from '../entities/OrderEntity';
import { ShipmentEntity } from '../entities/ShipmentEntity';
import { Repository } from './Repository';

@Injectable('OrdersRepository')
export class OrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'customer/orders';
    readonly model = OrderEntity;

    public async setCustomerShipment(input: ChangeOrderShipmentDto) {
        const { orderId, shippingProvider, trackingNumber } = input;
        const { data } = await this.endpoint.post(`${orderId}/customer-shipment`, {
            shippingProvider,
            trackingNumber,
        });

        return plainToInstance(ShipmentEntity, data);
    }
}

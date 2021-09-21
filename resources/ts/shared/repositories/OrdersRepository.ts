import { plainToClass } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { ChangeOrderShipmentDto } from '../dto/ChangeOrderShipmentDto';
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

        return plainToClass(ShipmentEntity, data);
    }
}

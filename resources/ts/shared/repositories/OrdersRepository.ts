import { plainToClass } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { ChangeOrderCustomerShipmentDto } from '../dto/ChangeOrderCustomerShipmentDto';
import { CustomerShipmentEntity } from '../entities/CustomerShipmentEntity';
import { Repository } from './Repository';

@Injectable('OrdersRepository')
export class OrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'customer/orders';
    readonly model = OrderEntity;

    public async setShipment(input: ChangeOrderCustomerShipmentDto) {
        const { orderId, shippingProvider, trackingNumber } = input;
        const { data } = await this.endpoint.post(`${orderId}/customer-shipment`, {
            shipping_provider: shippingProvider,
            tracking_number: trackingNumber,
        });

        return plainToClass(CustomerShipmentEntity, data);
    }
}

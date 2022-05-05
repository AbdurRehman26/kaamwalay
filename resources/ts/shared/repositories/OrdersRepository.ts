import { plainToInstance } from 'class-transformer';
import { AttachShippingAddressDto } from '@shared/dto/AttachShippingAddressDto';
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

    public async deleteOrder(orderId: number) {
        const { data } = await this.endpoint.delete(`${orderId}`);
        return data;
    }

    public async attachShippingAddress(input: AttachShippingAddressDto): Promise<OrderEntity> {
        // noinspection PointlessBooleanExpressionJS
        const body: Record<string, any> = {
            shippingMethodId: input.shippingMethod,
        };

        if (input.address) {
            body.customerAddress = {
                id: null,
            };

            body.shippingAddress = {
                firstName: input.address.firstName,
                lastName: input.address.lastName,
                address: input.address.address,
                city: input.address.city,
                state: input.address.state,
                zip: input.address.zip,
                phone: input.address.phone,
                flat: input.address.flat,
                saveForLater: !!input.saveForLater,
            };
        }

        const { data } = await this.endpoint.put(`${input.orderId}/shipping-method`, body);

        return this.toEntity(data);
    }
}

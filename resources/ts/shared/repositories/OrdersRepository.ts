import { AxiosRequestConfig } from 'axios';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { AttachShippingAddressDto } from '@shared/dto/AttachShippingAddressDto';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { Injectable } from '../decorators/Injectable';
import { ChangeOrderShipmentDto } from '../dto/ChangeOrderShipmentDto';
import { OrderEntity } from '../entities/OrderEntity';
import { ShipmentEntity } from '../entities/ShipmentEntity';
import { Repository } from './Repository';

@Injectable('OrdersRepository')
export class OrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'customer/orders';
    readonly model = OrderEntity;
    readonly endpointConfig = {
        version: 'v3',
    };

    public async getOrder(
        resourceId: any,
        config?: AxiosRequestConfig,
        transformModel?: ClassConstructor<OrderEntity>,
    ): Promise<OrderEntity> {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(this.endpointPath, {
            version: 'v3',
        });

        const { data } = await endpoint.get(`/${resourceId}`, config);

        return this.toEntity(data, null, transformModel);
    }

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
                firstName: input.address.getFirstName() ?? input.address.firstName,
                lastName: input.address.getLastName() ?? input.address.lastName,
                address: input.address.address,
                address2: input.address.address2,
                city: input.address.city,
                state: input.address.state,
                zip: input.address.zip,
                phone: input.address.phone,
                flat: input.address.flat,
                countryId: input.address.countryId ?? input.address.country.id,
                saveForLater: !!input.saveForLater,
            };
        }

        const { data } = await this.endpoint.put(`${input.orderId}/shipping-method`, body);

        return this.toEntity(data);
    }
}

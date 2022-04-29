import { Injectable } from '../decorators/Injectable';
import { ShippingMethodEntity } from '../entities/ShippingMethodEntity';
import { Repository } from './Repository';

@Injectable('ShippingMethodsRepository')
export class ShippingMethodsRepository extends Repository<ShippingMethodEntity> {
    readonly endpointPath: string = 'customer/orders/shipping-methods';
    readonly model = ShippingMethodEntity;
}

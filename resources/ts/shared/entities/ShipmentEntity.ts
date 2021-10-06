import { Field } from '../decorators/Field';
import { Entity } from './Entity';

export class ShipmentEntity extends Entity {
    public id!: number;

    @Field('shipment_date')
    public shipmentDate?: null | string;

    @Field('tracking_number')
    public trackingNumber!: string;

    @Field('shipping_provider')
    public shippingProvider!: string;

    @Field('tracking_url')
    public trackingUrl!: string | null;
}

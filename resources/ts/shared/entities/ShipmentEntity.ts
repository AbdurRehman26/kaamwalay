import { Entity } from './Entity';

export class ShipmentEntity extends Entity {
    public id!: number;
    public shipmentDate?: null | string;
    public trackingNumber!: string;
    public shippingProvider!: string;
}

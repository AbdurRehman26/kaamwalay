import { Entity } from './Entity';

export class ShipmentEntity extends Entity {
    public id!: number;
    public trackingNumber!: string;
    public shippingProvider!: string;
    public shipmentDate!: string | null;
    public trackingUrl!: string | null;
}

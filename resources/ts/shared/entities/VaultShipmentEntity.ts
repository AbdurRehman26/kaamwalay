import { Type } from 'class-transformer';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { VaultShipmentStatusEntity } from '@shared/entities/VaultShipmentStatusEntity';
import { DateField } from '../decorators/DateField';
import { Entity } from './Entity';

export class VaultShipmentEntity extends Entity {
    public shipmentNumber!: string;
    public cardsNumber!: number;
    public trackingNumber!: string;
    public trackingUrl!: string;

    @Type(() => VaultShipmentStatusEntity)
    public vaultShipmentStatus!: VaultShipmentStatusEntity;

    @Type(() => CustomerEntity)
    public customer?: CustomerEntity | null;

    @DateField()
    public shippedAt!: Date;
}

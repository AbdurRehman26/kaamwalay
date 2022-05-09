import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';

export class ChangeOrderShipmentDto {
    orderId!: number;
    trackingNumber?: string;
    shippingProvider?: string;
    shippingMethod?: Pick<ShippingMethodEntity, 'code'>;
}

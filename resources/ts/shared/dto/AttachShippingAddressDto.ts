import { ShippingMethodType } from '../constants/ShippingMethodType';
import { AddressEntity } from '../entities/AddressEntity';

export class AttachShippingAddressDto {
    public orderId!: number;
    public address?: AddressEntity;
    public saveForLater?: boolean;
    public shippingMethod?: Exclude<
        ShippingMethodType,
        ShippingMethodType.VaultStorage | ShippingMethodType.InsuredShipping
    >;
}

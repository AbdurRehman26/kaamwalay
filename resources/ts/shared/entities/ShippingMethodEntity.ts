import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { Entity } from './Entity';

export class ShippingMethodEntity extends Entity {
    public name!: string;
    public code!: ShippingMethodType | string;
}

export const DefaultShippingMethodEntity = {
    id: 1,
    code: ShippingMethodType.InsuredShipping,
    name: 'Shipping',
} as ShippingMethodEntity;

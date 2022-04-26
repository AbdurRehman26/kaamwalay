import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { Entity } from './Entity';

export class ShippingMethodEntity extends Entity {
    public name!: string;
    public code!: string;
}

export const DefaultShippingMethodEntity = {
    id: 1,
    code: ShippingMethodType.InsuredShipping,
    name: 'Insured Shipping',
} as ShippingMethodEntity;

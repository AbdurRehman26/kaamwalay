import { Entity } from '@shared/entities/Entity';

export class OrderCouponEntity extends Entity {
    public code!: string;
    public discountStatement!: string;
}

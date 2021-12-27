import { Entity } from '@shared/entities/Entity';

export class OrderCouponEntity extends Entity {
    public code!: string;
    // Todo: discountStatement will get removed, but now needs to be here due to different ussages on customer & admin side
    public discountStatement!: string;
    public description!: string;
}

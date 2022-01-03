import { Entity } from './Entity';

export class CouponApplicableEntity extends Entity {
    public id!: number;
    public code!: string;
    public label!: string;
    public apiSuffix!: string;
    public description!: string;
    public isActive!: boolean;
    public couponables!: any;
}

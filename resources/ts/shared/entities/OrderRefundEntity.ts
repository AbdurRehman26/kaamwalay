import { Entity } from './Entity';

export class OrderRefundEntity extends Entity {
    public notes!: string;
    public amount!: string;
    public type!: string;
    public author!: string;
}

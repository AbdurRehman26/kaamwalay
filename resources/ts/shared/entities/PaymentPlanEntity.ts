import { Entity } from './Entity';

export class PaymentPlanEntity extends Entity {
    public price!: number;
    public turnaround!: string;
    public maxProtectionAmount!: number;
}

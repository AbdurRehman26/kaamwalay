import { Field } from '../decorators/Field';
import { Entity } from './Entity';

export class PaymentPlanEntity extends Entity {
    public price!: number;
    public turnaround!: string;

    @Field('max_protection_amount')
    public maxProtectionAmount!: number;
}

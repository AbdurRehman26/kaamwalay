import { Expose } from 'class-transformer';

import { Entity } from '@shared/entities/Entity';

export class CustomerOrdersPaymentPlanEntity extends Entity {
    public price!: number;
    public turnaround!: string;

    @Expose({ name: 'max_protection_amount' })
    public maxProtectionAmount!: number;
}

import { Entity } from './Entity';

export class ReferralWithdrawEntity extends Entity {
    public completedAt!: Date;
    public payoutAccount!: string;
    public status!: string;
    public amount!: number;
}

import { Entity } from './Entity';

export class ReferralWithdrawEntity extends Entity {
    public dateInitiated!: string;
    public completedAt!: string;
    public payoutAccount!: string;
    public status!: string;
    public amount!: number;
}

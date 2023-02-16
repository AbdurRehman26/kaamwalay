import { Entity } from './Entity';

export class ReferrerEntity extends Entity {
    public referralCode!: string;
    public withdrawableCommission!: number;
    public linkClicks!: number;
    public successfulSignups!: number;
    public referralOrders!: number;
    public isReferralActive!: number;
    public referralUrl!: string;
    public totalEarned!: number;
}

import { UserEntity } from './UserEntity';

export class ReferrerEntity extends UserEntity {
    public id!: number;
    public referralCode!: string;
    public withdrawableCommission!: number;
    public linkClicks!: number;
    public successfulSignups!: number;
    public referralOrders!: number;
    public isReferralActive!: number;
}

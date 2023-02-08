import { Type } from 'class-transformer';
import { Entity } from './Entity';
import { UserEntity } from './UserEntity';

export class ReferrerEntity extends Entity {
    public referralCode!: string;
    public withdrawableCommission!: string;
    public linkClicks!: number;
    public successfulSignups!: number;
    public referralOrders!: number;
    public isReferralActive!: number;
    public referralUrl!: string;

    @Type(() => UserEntity)
    public user!: UserEntity;
    public fullName!: string;
}

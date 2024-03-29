import { Type } from 'class-transformer';
import { ReferrerEntity } from './ReferrerEntity';
import { SalesRepEntity } from './SalesRepEntity';
import { UserEntity } from './UserEntity';

export class CustomerEntity extends UserEntity {
    public submissions!: number;
    public cardsCount!: number;
    public cards!: number;
    public createdBy!: UserEntity;
    public lastLoginAt?: string;
    public paidAt!: string;
    public signedUpAt!: string;
    public orders?: number;
    public sales?: number;
    public unpaidCommission?: number;
    public unpaidCommissionTillLastMonth?: number;
    public paidCommission?: number;
    public submissionTotal!: number;
    public totalCommissions!: number;
    public commission!: number;
    public totalSpent!: number;

    @Type(() => ReferrerEntity)
    public referrer!: ReferrerEntity;

    @Type(() => UserEntity)
    public referredBy!: UserEntity;

    @Type(() => SalesRepEntity)
    public salesman!: SalesRepEntity;
    public signUps!: number;
    public isReferralActive!: number;
}

import { nameInitials } from '@shared/lib/strings/initials';
import { Entity } from './Entity';

export class ReferralCommissionEarningsEntity extends Entity {
    public cards!: number;
    public commission!: number;
    public firstName!: string;
    public lastName!: string;
    public fullName!: string;
    public paidAt!: string;
    public submissionTotal!: number;
    public profileImage!: string;

    public getInitials() {
        return nameInitials(this.fullName);
    }
}

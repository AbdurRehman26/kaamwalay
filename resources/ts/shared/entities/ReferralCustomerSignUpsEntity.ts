import { nameInitials } from '@shared/lib/strings/initials';
import { Entity } from './Entity';

export class ReferralCustomerSignUpsEntity extends Entity {
    public cardsCount!: number;
    public totalCommissions!: number;
    public firstName!: string;
    public lastName!: string;
    public fullName!: string;
    public signedUpAt!: string;
    public submissions!: number;
    public profileImage!: string;
    public totalSpent!: number;

    public getInitials() {
        return nameInitials(this.fullName);
    }
}

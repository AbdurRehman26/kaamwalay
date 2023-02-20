import { Type } from 'class-transformer';
import { Entity } from './Entity';
import { UserEntity } from './UserEntity';

export class PayoutEntity extends Entity {
    public initiatedAt!: string;
    public completedAt!: string;
    public payoutAccount!: string;
    public payoutStatus!: boolean;
    public amount!: number;

    @Type(() => UserEntity)
    public user!: UserEntity;

    @Type(() => UserEntity)
    public paidBy!: UserEntity;
}

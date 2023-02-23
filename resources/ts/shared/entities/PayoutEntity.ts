import { Type } from 'class-transformer';
import { Entity } from './Entity';
import { PayoutStatusEntity } from './PayoutStatusEntity';
import { UserEntity } from './UserEntity';

export class PayoutEntity extends Entity {
    public completedAt!: string;
    public payoutAccount!: string;
    public amount!: number;

    @Type(() => PayoutStatusEntity)
    public status!: PayoutStatusEntity;

    @Type(() => UserEntity)
    public user!: UserEntity;

    @Type(() => UserEntity)
    public paidBy!: UserEntity;
}

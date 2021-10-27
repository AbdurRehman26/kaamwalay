import { Type } from 'class-transformer';
import { CardEntity } from '@shared/entities/CardEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { Entity } from './Entity';

export class OrderExtraChargeEntity extends Entity {
    public orderId!: string;
    public notes!: string;
    public amount!: string;
    public type!: string;

    @Type(() => CardEntity)
    card!: CardEntity;

    @Type(() => UserEntity)
    user!: UserEntity;
}

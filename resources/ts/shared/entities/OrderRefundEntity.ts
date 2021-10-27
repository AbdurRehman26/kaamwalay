import { Type } from 'class-transformer';
import { UserEntity } from '@shared/entities/UserEntity';
import { Entity } from './Entity';

export class OrderRefundEntity extends Entity {
    public notes!: string;
    public amount!: string;
    public type!: string;

    @Type(() => UserEntity)
    user!: UserEntity;
}

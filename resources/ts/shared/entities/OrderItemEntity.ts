import { Type } from 'class-transformer';
import { OrderItemStatusEntity } from '@shared/entities/OrderItemStatusEntity';
import { OrderItemStatusHistoryEntity } from '@shared/entities/OrderItemStatusHistoryEntity';
import { CardProductEntity } from './CardProductEntity';
import { Entity } from './Entity';
import { UserCardEntity } from './UserCardEntity';

export class OrderItemEntity extends Entity {
    public quantity!: number;
    public declaredValuePerUnit!: number;
    public certificateNumber!: string;
    public orderId!: number;
    public notes!: string;
    public internalNotes!: string;

    @Type(() => OrderItemStatusHistoryEntity || OrderItemStatusEntity)
    public status!: any;

    @Type(() => CardProductEntity)
    public cardProduct!: CardProductEntity;

    @Type(() => UserCardEntity)
    public userCard!: UserCardEntity;
}

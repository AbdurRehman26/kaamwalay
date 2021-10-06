import { Type } from 'class-transformer';
import { CardProductEntity } from './CardProductEntity';
import { Entity } from './Entity';
import { OrderItemStatusEntity } from './OrderItemStatusEntity';
import { UserCardEntity } from './UserCardEntity';

export class OrderItemEntity extends Entity {
    public quantity!: number;
    public declaredValuePerUnit!: number;
    public certificateNumber!: string;
    public orderId!: number;

    @Type(() => OrderItemStatusEntity)
    public status!: OrderItemStatusEntity;

    @Type(() => CardProductEntity)
    public cardProduct!: CardProductEntity;

    @Type(() => UserCardEntity)
    public userCard!: UserCardEntity;
}

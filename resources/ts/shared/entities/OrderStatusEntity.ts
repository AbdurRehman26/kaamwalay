import { Entity } from '@shared/entities/Entity';
import { OrderStatusEnum } from '../constants/OrderStatusEnum';

export class OrderStatusEntity extends Entity {
    public name!: string;
    public code!: string;
    public description!: string;

    is(status: OrderStatusEnum) {
        return this.id === status;
    }
}

import { OrderStatusEnum } from '../constants/OrderStatusEnum';
import { Entity } from './Entity';

export class OrderStatusEntity extends Entity {
    public name!: string;
    public code!: string;
    public description!: string;

    is(status: OrderStatusEnum) {
        return this.id === status;
    }
}

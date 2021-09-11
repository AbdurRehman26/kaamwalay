import { Entity } from '@shared/entities/Entity';

export class OrderStatusEntity extends Entity {
    public name!: string;
    public code!: string;
    public description!: string;
}

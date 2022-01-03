import { Entity } from './Entity';

export class PromoCodeApplicableEntity extends Entity {
    public id!: number;
    public code!: string;
    public description!: string;
    public isActive!: boolean;
    public label!: string;
}

import { Entity } from './Entity';

export class PromoCodeStatsEntity extends Entity {
    public timesUsed!: number;
    public totalDiscount!: string;
    public totalRevenue!: string;
}

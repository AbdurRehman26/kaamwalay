import { Entity } from './Entity';

export class WalletTransactionHistoryEntity extends Entity {
    public description!: string;
    public amount!: number;
}

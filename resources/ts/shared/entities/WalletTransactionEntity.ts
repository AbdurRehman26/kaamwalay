import { Entity } from './Entity';

export class WalletTransactionEntity extends Entity {
    public amount!: string;
    public description!: string;
}

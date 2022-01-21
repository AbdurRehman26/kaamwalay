import { Entity } from './Entity';

export class BlockchainTransactionEntity extends Entity {
    public amount!: string;
    public hash!: string;
    public completeHash!: string;
}

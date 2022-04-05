import { Type } from 'class-transformer';
import { BlockchainTransactionEntity } from '@shared/entities/BlockchainTransactionEntity';
import { CardEntity } from './CardEntity';
import { Entity } from './Entity';
import { PayerEntity } from './PayerEntity';

export class OrderPaymentEntity extends Entity {
    @Type(() => CardEntity)
    public card?: CardEntity | null;

    @Type(() => PayerEntity)
    public payer?: PayerEntity | null;

    @Type(() => BlockchainTransactionEntity)
    public transaction!: BlockchainTransactionEntity | null;
}

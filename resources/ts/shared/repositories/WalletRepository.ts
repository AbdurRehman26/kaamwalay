import { Injectable } from '@shared/decorators/Injectable';
import { Repository } from '@shared/repositories/Repository';
import { WalletTransactionEntity } from '@shared/entities/WalletTransactionEntity';

@Injectable('WalletRepository')
export class WalletRepository extends Repository<WalletTransactionEntity> {
    readonly endpointPath: string = 'wallet/transactions';
    readonly model = WalletTransactionEntity;
}

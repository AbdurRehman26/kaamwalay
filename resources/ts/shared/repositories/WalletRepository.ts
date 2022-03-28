import { Injectable } from '@shared/decorators/Injectable';
import { WalletTransactionEntity } from '@shared/entities/WalletTransactionEntity';
import { Repository } from '@shared/repositories/Repository';

@Injectable('WalletRepository')
export class WalletRepository extends Repository<WalletTransactionEntity> {
    readonly endpointPath: string = 'customer/wallet/transactions';
    readonly model = WalletTransactionEntity;
}

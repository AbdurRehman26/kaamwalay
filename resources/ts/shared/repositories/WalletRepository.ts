import { Injectable } from '@shared/decorators/Injectable';
import { Repository } from '@shared/repositories/Repository';
import { WalletTransactionEntity } from '@shared/entities/WalletTransactionEntity';

@Injectable('WalletRepository')
export class WalletRepository extends Repository<WalletTransactionEntity> {
    readonly endpointPath: string = 'customer/wallet/transactions';
    readonly model = WalletTransactionEntity;
}

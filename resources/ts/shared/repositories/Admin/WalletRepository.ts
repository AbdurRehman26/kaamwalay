import { Injectable } from '../../decorators/Injectable';
import { WalletEntity } from '../../entities/WalletEntity';
import { Repository } from '../Repository';
import { plainToInstance } from 'class-transformer';
import { WalletTransactionHistoryEntity } from '@shared/entities/WalletTransactionHistoryEntity';

@Injectable('AdminWalletRepository')
export class WalletRepository extends Repository<WalletEntity> {
    readonly endpointPath: string = 'admin/wallets';
    readonly model = WalletEntity;

    async getHistory(walletId: number): Promise<WalletTransactionHistoryEntity[]> {
        const { data } = await this.endpoint.get<WalletTransactionHistoryEntity[]>(`${walletId}/history`);
        return plainToInstance(WalletTransactionHistoryEntity, data);
    }

    async addCredit(walletId: number, amount: string | number) {
        const { data } = await this.endpoint.post(`${walletId}/credit`, { amount: Number(amount) });
        return plainToInstance(WalletTransactionHistoryEntity, data);
    }
}

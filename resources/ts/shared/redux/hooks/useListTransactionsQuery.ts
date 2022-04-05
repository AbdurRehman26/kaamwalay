import { AxiosRequestConfig } from 'axios';
import { WalletTransactionEntity } from '@shared/entities/WalletTransactionEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listTransactionsAction } from '@shared/redux/slices/walletSlice';

export function useListTransactionsQuery(config?: AxiosRequestConfig) {
    return useListQuery(listTransactionsAction, WalletTransactionEntity, (state) => state.transactions, config);
}

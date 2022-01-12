import { AxiosRequestConfig } from 'axios';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listTransactionsAction } from '@shared/redux/slices/walletSlice';
import { WalletTransactionEntity } from '@shared/entities/WalletTransactionEntity';

export function useListTransactionsQuery(config?: AxiosRequestConfig) {
    return useListQuery(listTransactionsAction, WalletTransactionEntity, (state) => state.transactions, config);
}

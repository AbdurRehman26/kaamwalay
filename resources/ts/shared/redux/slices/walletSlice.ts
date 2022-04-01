import { createSlice } from '@reduxjs/toolkit';
import { WalletTransactionEntity } from '@shared/entities/WalletTransactionEntity';
import { WalletRepository } from '@shared/repositories/WalletRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<WalletTransactionEntity> {}

const walletThunk = createRepositoryThunk('transactions', WalletRepository);

export const walletSlice = createSlice({
    name: walletThunk.name,
    initialState: {
        ...walletThunk.initialState,
    } as StateType,
    reducers: {
        invalidateTransactions: walletThunk.invalidateEntities,
    },
    extraReducers(builder) {
        walletThunk.buildReducers(builder);
    },
});
export const { invalidateTransactions } = walletSlice.actions;
export const { listAction: listTransactionsAction, showAction: showTransactionAction } = walletThunk;

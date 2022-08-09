import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface WalletAmountState {
    amount: number;
}

export interface WalletSliceState {
    walletAmountState: WalletAmountState;
}

const initialState: WalletSliceState = {
    walletAmountState: {
        amount: 0,
    },
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWalletAmount: (state, action: PayloadAction<number>) => {
            state.walletAmountState.amount = action.payload;
        },
    },
});

export const { setWalletAmount } = walletSlice.actions;

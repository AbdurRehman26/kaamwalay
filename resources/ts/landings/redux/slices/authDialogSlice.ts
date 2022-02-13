import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthDialogState {
    dialogOpened: boolean;
}

const initialState: AuthDialogState = {
    dialogOpened: false,
};

export const authDialogSlice = createSlice({
    name: 'authDialogSlice',
    initialState,
    reducers: {
        dialogVisibility: (state, action: PayloadAction<boolean>) => {
            state.dialogOpened = action.payload;
        },
    },
});

export const { dialogVisibility } = authDialogSlice.actions;

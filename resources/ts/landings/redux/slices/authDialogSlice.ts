import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthDialogState {
    dialogOpened: boolean;
    headerDialogOpened: boolean;
}

const initialState: AuthDialogState = {
    dialogOpened: false,
    headerDialogOpened: false,
};

export const authDialogSlice = createSlice({
    name: 'authDialogSlice',
    initialState,
    reducers: {
        dialogVisibility: (state, action: PayloadAction<boolean>) => {
            state.dialogOpened = action.payload;
        },
        headerDialogVisibility: (state, action: PayloadAction<boolean>) => {
            state.headerDialogOpened = action.payload;
        },
    },
});

export const { dialogVisibility, headerDialogVisibility } = authDialogSlice.actions;

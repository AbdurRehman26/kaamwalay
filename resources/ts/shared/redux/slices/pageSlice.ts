import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PageState {
    drawerOpened: boolean;
    cardsManagementSelected: boolean;
    referralProgramSelected: boolean;
}

const initialState: PageState = {
    drawerOpened: true,
    cardsManagementSelected: false,
    referralProgramSelected: false,
};

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        drawerVisibility: (state, action: PayloadAction<boolean>) => {
            state.drawerOpened = action.payload;
        },
        setCardsManagementState: (state, action: PayloadAction<boolean>) => {
            state.cardsManagementSelected = action.payload;
        },
        setReferralProgramState: (state, action: PayloadAction<boolean>) => {
            state.referralProgramSelected = action.payload;
        },
    },
});

export const { drawerVisibility, setCardsManagementState, setReferralProgramState } = pageSlice.actions;

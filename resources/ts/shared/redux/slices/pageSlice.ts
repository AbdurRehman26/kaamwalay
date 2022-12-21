import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PageState {
    drawerOpened: boolean;
    cardsManagementSelected: boolean;
}

const initialState: PageState = {
    drawerOpened: true,
    cardsManagementSelected: false,
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
    },
});

export const { drawerVisibility, setCardsManagementState } = pageSlice.actions;

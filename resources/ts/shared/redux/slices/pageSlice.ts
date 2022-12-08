import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface PageState {
    drawerOpened: boolean;
}

const initialState: PageState = {
    drawerOpened: true,
};

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        drawerVisibility: (state, action: PayloadAction<boolean>) => {
            state.drawerOpened = action.payload;
        },
    },
});

export const { drawerVisibility } = pageSlice.actions;

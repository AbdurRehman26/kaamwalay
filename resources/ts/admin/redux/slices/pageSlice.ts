import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageState {
    drawerOpened: boolean;
}

const initialState: PageState = {
    drawerOpened: true,
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        drawerVisibility: (state, action: PayloadAction<boolean>) => {
            state.drawerOpened = action.payload;
        },
    },
});

export const { drawerVisibility } = pageSlice.actions;
export default pageSlice.reducer;

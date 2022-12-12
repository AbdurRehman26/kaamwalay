import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface DashboardSliceTypes {
    isNavigationDrawerOpen: boolean;
    dialog: boolean;
}

const initialState: DashboardSliceTypes = {
    isNavigationDrawerOpen: false,
    dialog: false,
};

export const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState,
    reducers: {
        setNavigationDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.isNavigationDrawerOpen = action.payload;
        },
        setDialog: (state, action: PayloadAction<boolean>) => {
            state.dialog = action.payload;
        },
    },
});

export const { setNavigationDrawerOpen, setDialog } = dashboardSlice.actions;

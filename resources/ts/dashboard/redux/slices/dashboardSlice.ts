import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface DashboardSliceTypes {
    isNavigationDrawerOpen: boolean;
}

const initialState: DashboardSliceTypes = {
    isNavigationDrawerOpen: false,
};

export const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState,
    reducers: {
        setNavigationDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.isNavigationDrawerOpen = action.payload;
        },
    },
});

export const { setNavigationDrawerOpen } = dashboardSlice.actions;

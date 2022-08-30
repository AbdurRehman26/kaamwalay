import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface OpenLabelDialog {
    labelDialog: boolean;
}

export interface AdminEditLabelDialogSliceState {
    openLabelDialog: OpenLabelDialog;
}

const initialState: AdminEditLabelDialogSliceState = {
    openLabelDialog: {
        labelDialog: false,
    },
};

export const adminEditLabelDialogSlice = createSlice({
    name: 'adminEditLabelDialog',
    initialState,
    reducers: {
        setEditLabelDialog: (state, action: PayloadAction<boolean>) => {
            state.openLabelDialog.labelDialog = action.payload;
        },
    },
});

export const { setEditLabelDialog } = adminEditLabelDialogSlice.actions;

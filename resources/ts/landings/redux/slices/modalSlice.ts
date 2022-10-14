import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface OpenLabelDialog {
    labelDialog: boolean;
}

export interface ModalSliceState {
    openLabelDialog: OpenLabelDialog;
}

const initialState: ModalSliceState = {
    openLabelDialog: {
        labelDialog: false,
    },
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setEditLabelDialog: (state, action: PayloadAction<boolean>) => {
            state.openLabelDialog.labelDialog = action.payload;
        },
    },
});

export const { setEditLabelDialog } = modalSlice.actions;

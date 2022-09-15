import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CardLabelEntity } from '@shared/entities/CardLabelEntity';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

export interface OpenLabelDialog {
    labelDialog: boolean;
}

export interface OrderLabels {
    labels: CardLabelEntity[];
}

export interface AdminOrderLabelsSliceState {
    openLabelDialog: OpenLabelDialog;
    orderLabels: OrderLabels;
}

const initialState: AdminOrderLabelsSliceState = {
    openLabelDialog: {
        labelDialog: false,
    },
    orderLabels: {
        labels: [],
    },
};

export const getOrderLabels = createAsyncThunk('orderLabels/getOrderLabels', async (input: { id: string }) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/orders/${input.id}/labels`);
    const orderLabels = await endpoint.get('');
    return orderLabels.data;
});

export const adminOrderLabelsSlice = createSlice({
    name: 'adminOrderLabels',
    initialState,
    reducers: {
        setEditLabelDialog: (state, action: PayloadAction<boolean>) => {
            state.openLabelDialog.labelDialog = action.payload;
        },
    },
    extraReducers: {
        [getOrderLabels.fulfilled as any]: (state, action) => {
            state.orderLabels.labels = action.payload;
        },
    },
});

export const { setEditLabelDialog } = adminOrderLabelsSlice.actions;

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OrderLabelsDto } from '@shared/dto/OrderLabelsDto';
import { CardLabelEntity } from '@shared/entities/CardLabelEntity';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

export interface OpenLabelDialog {
    labelDialog: boolean;
}

export interface OrderLabels {
    labels: CardLabelEntity[];
}

export interface CardsLabel {
    labels: CardLabelEntity;
}

export interface AdminOrderLabelsSliceState {
    openLabelDialog: OpenLabelDialog;
    orderLabels: OrderLabels;
    cardsLabel: CardsLabel;
}

const initialState: AdminOrderLabelsSliceState = {
    openLabelDialog: {
        labelDialog: false,
    },
    orderLabels: {
        labels: [],
    },
    cardsLabel: {
        labels: {} as CardLabelEntity,
    },
};

export const getOrderLabels = createAsyncThunk('orderLabels/getOrderLabels', async (input: { id: string }) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/orders/${input.id}/labels`);
    const orderLabels = await endpoint.get('');
    return orderLabels.data;
});

export const getCardsLabel = createAsyncThunk('orderLabels/getCardsLabel', async (input: { id: number }) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/cards/${input.id}/label`);
    const cardsLabel = await endpoint.get('');
    return cardsLabel.data;
});

export const updateCardsLabel = createAsyncThunk('orderLabels/updateCardsLabel', async (input: OrderLabelsDto) => {
    try {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/cards/labels/${input.cardLabelId}`);
        const orderLabels = await endpoint.put('', input);
        NotificationsService.success('Updated successfully!');
        return orderLabels.data;
    } catch (e: any) {
        NotificationsService.exception(e);
    }
});

export const adminOrderLabelsSlice = createSlice({
    name: 'adminOrderLabels',
    initialState,
    reducers: {
        setEditLabelDialog: (state, action: PayloadAction<boolean>) => {
            state.openLabelDialog.labelDialog = action.payload;
        },
        updateLabelField: (state, action: PayloadAction<{ fieldName: string; newValue: any }>) => {
            // @ts-ignore
            state.orderLabels[action.payload.fieldName] = action.payload.newValue;
            console.log(action.payload.newValue);
        },
    },
    extraReducers: {
        [getOrderLabels.fulfilled as any]: (state, action) => {
            state.orderLabels.labels = action.payload;
            state.cardsLabel.labels = {} as CardLabelEntity;
        },
        [getCardsLabel.fulfilled as any]: (state, action) => {
            state.cardsLabel.labels = action.payload;
            state.orderLabels.labels = [];
        },
    },
});

export const { setEditLabelDialog, updateLabelField } = adminOrderLabelsSlice.actions;

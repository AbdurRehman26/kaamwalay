import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OrderLabelsDto } from '@shared/dto/OrderLabelsDto';
import { CardLabelEntity } from '@shared/entities/CardLabelEntity';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

export interface OpenLabelDialog {
    labelDialog: boolean;
}

export interface CardLabelId {
    id: number;
}

export interface OrderLabels {
    labels: CardLabelEntity[];
}

export interface SingleLabelData {
    labelData: OrderLabelsDto;
}

export interface MultipleLabelData {
    labelData: OrderLabelsDto[];
}

export interface CardsLabel {
    labels: CardLabelEntity;
}

export interface AdminOrderLabelsSliceState {
    openLabelDialog: OpenLabelDialog;
    orderLabels: OrderLabels;
    cardsLabel: CardsLabel;
    singleLabelData: SingleLabelData;
    mutlipleLabelData: MultipleLabelData;
    cardId: CardLabelId;
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
    singleLabelData: {
        labelData: {} as OrderLabelsDto,
    },
    mutlipleLabelData: {
        labelData: [],
    },
    cardId: {
        id: 0,
    },
};

export const getOrderLabels = createAsyncThunk('orderLabels/getOrderLabels', async (input: { id: string }) => {
    try {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/orders/${input.id}/labels`);
        const orderLabels = await endpoint.get('');
        return orderLabels.data;
    } catch (e: any) {
        NotificationsService.exception(e);
    }
});

export const getCardLabel = createAsyncThunk('orderLabels/getCardLabel', async (input: { id: number }) => {
    try {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/cards/${input.id}/label`);
        const cardsLabel = await endpoint.get('');
        return cardsLabel.data;
    } catch (e: any) {
        NotificationsService.exception(e);
    }
});

export const updateMultipleLabels = createAsyncThunk(
    'orderLabels/updateMultipleLabels',
    async (input: { data: OrderLabelsDto[]; id: any }) => {
        try {
            const apiService = app(APIService);
            const endpoint = apiService.createEndpoint(`admin/orders/${input.id}/labels`);
            const orderLabels = await endpoint.put('', input);
            NotificationsService.success('Updated successfully!');
            return orderLabels.data;
        } catch (e: any) {
            NotificationsService.exception(e);
        }
    },
);

export const updateCardLabel = createAsyncThunk('orderLabels/updateCardLabel', async (input: OrderLabelsDto) => {
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
        updateSingleCardLabel: (state, action: PayloadAction<any>) => {
            state.singleLabelData.labelData = action.payload;
        },
        removeCardLabels: (state, action: PayloadAction<number>) => {
            state.mutlipleLabelData.labelData = state.mutlipleLabelData.labelData.filter((index) => {
                if (index.cardLabelId !== action.payload) {
                    return index;
                }
                return null;
            });
        },
        updateMultipleCardsLabel: (state, action: PayloadAction<any>) => {
            const hasValue = state.mutlipleLabelData.labelData.find((index) => {
                return index.cardLabelId === action.payload.cardLabelId ? true : false;
            });
            if (!hasValue) {
                state.mutlipleLabelData.labelData.push(action.payload);
            }
        },
    },
    extraReducers: {
        [getOrderLabels.fulfilled as any]: (state, action) => {
            state.orderLabels.labels = action.payload;
            state.cardsLabel.labels = {} as CardLabelEntity;
        },
        [getCardLabel.fulfilled as any]: (state, action) => {
            state.cardsLabel.labels = action.payload;
            state.orderLabels.labels = [];
        },
    },
});

export const { setEditLabelDialog, updateSingleCardLabel, updateMultipleCardsLabel, removeCardLabels } =
    adminOrderLabelsSlice.actions;

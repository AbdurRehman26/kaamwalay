import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OrderLabelsDto } from '@shared/dto/OrderLabelsDto';
import { CardLabelEntity } from '@shared/entities/CardLabelEntity';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
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

export interface MultipleLabelData {
    labelData: OrderLabelsDto[];
}

export interface CardsLabel {
    labels: CardLabelEntity;
}

export interface CardsLabelFileUrl {
    url: any;
}

export interface AdminOrderLabelsSliceState {
    openLabelDialog: OpenLabelDialog;
    orderLabels: OrderLabels;
    cardsLabel: CardsLabel;
    multipleLabelData: MultipleLabelData;
    cardId: CardLabelId;
    labelsUrl: CardsLabelFileUrl;
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
    multipleLabelData: {
        labelData: [],
    },
    cardId: {
        id: 0,
    },
    labelsUrl: {
        url: {},
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
        removeCardLabels: (state, action: PayloadAction<number>) => {
            state.multipleLabelData.labelData = state.multipleLabelData.labelData.filter((index) => {
                if (index.cardLabelId !== action.payload) {
                    return index;
                }
                return null;
            });
        },
        updateMultipleCardsLabel: (state, action: PayloadAction<any>) => {
            const hasValue = state.multipleLabelData.labelData.find((index) => {
                return index.cardLabelId === action.payload.cardLabelId &&
                    index.certificateNumber === action.payload.certificateNumber
                    ? true
                    : false;
            });
            if (!hasValue) {
                state.multipleLabelData.labelData.push(action.payload);
            } else {
                const indexes = state.orderLabels.labels
                    .map((data, idx) => (data.cardLabelId === action.payload.cardLabelId ? idx : ''))
                    .filter(String);

                indexes.forEach((index) => {
                    state.orderLabels.labels[Number(index)].lineOne = action.payload.lineOne;
                    state.orderLabels.labels[Number(index)].lineTwo = action.payload.lineTwo;
                    state.orderLabels.labels[Number(index)].lineThree = action.payload.lineThree;
                    state.orderLabels.labels[Number(index)].lineFour = action.payload.lineFour;
                    state.orderLabels.labels[Number(index)].persistChanges = action.payload.persistChanges;
                });

                const payloadIndexes = state.multipleLabelData.labelData
                    .map((data, idx) => (data.certificateNumber === action.payload.certificateNumber ? idx : ''))
                    .filter(String);

                payloadIndexes.forEach((index) => {
                    state.multipleLabelData.labelData[Number(index)] = action.payload;
                });
            }
        },
        updateCardLabelPayloadData: (state, action: PayloadAction<any>) => {
            const payloadIndexes = state.multipleLabelData.labelData
                .map((data, idx) => (data.certificateNumber === action.payload.certificateNumber ? idx : ''))
                .filter(String);

            payloadIndexes.forEach((index) => {
                state.multipleLabelData.labelData[Number(index)] = action.payload;
            });
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
        [updateMultipleLabels.fulfilled as any]: (state, action) => {
            state.labelsUrl.url = action.payload;
            downloadFromUrl(action.payload.url, `RG000034_label.xlsx`);
        },
    },
});

export const { setEditLabelDialog, updateMultipleCardsLabel, updateCardLabelPayloadData, removeCardLabels } =
    adminOrderLabelsSlice.actions;

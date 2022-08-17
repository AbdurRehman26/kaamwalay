import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { app } from '@shared/lib/app';
import { CardsRepository } from '@shared/repositories/Admin/CardsRepository';
import { APIService } from '@shared/services/APIService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CardProductEntity> {}

// interface AddCardDialogState {
//     cardCategories?: CardCategoryEntity | null;
//     cardSeries?: CardSeriesEntity | null;
//     cardSets?: CardSetEntity | null;
// }

// const initialState: AddCardDialogState = {
//     cardCategories: null,
//     cardSeries: null,
//     cardSets: null,
// }

const adminCardsThunk = createRepositoryThunk('adminCards', CardsRepository);

export const getAllCards = createAsyncThunk('newCard/getAllCards', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/cards`);
    const cardCategories = await endpoint.get('');
    return cardCategories.data;
});

export const getCardCategories = createAsyncThunk('newCard/getCardCategories', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/cards/categories`);
    const cardCategories = await endpoint.get('');
    return cardCategories.data;
});

export const getCardSeries = createAsyncThunk('newCard/getCardSeries', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/cards/series`);
    return await endpoint.get('');
});

export const getCardSets = createAsyncThunk('newCard/getCardSets', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/cards/sets`);
    const cardSets = await endpoint.get('');
    return cardSets.data;
});

export const deleteCard = createAsyncThunk('newCard/deleteCard', async (cardId: number) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/cards/${cardId}`);
    const cardSets = await endpoint.delete('');
    return cardSets.data;
});

export const getCardData = createAsyncThunk('newCard/getCardData', async (cardId: number) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/cards/${cardId}`);
    return await endpoint.get('');
});

export const adminCardsSlice = createSlice({
    name: adminCardsThunk.name,
    initialState: {
        ...adminCardsThunk.initialState,
    } as StateType,
    reducers: {},
    // extraReducers: {
    // [getCardCategories.fulfilled as any]: (state, action) => {
    //     state.cardCategories = action.payload;
    // },
    // [getCardSeries.fulfilled as any]: (state, action) => {
    //     state.cardSeries = action.payload;
    // },
    // [getCardSets.fulfilled as any]: (state, action) => {
    //     state.cardSets = action.payload;
    // },
    // }
    extraReducers(builder) {
        adminCardsThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminCardsAction, showAction: showAdminCardAction } = adminCardsThunk;

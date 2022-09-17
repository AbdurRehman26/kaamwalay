import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { app } from '@shared/lib/app';
import { CardsRepository } from '@shared/repositories/Admin/CardsRepository';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CardProductEntity> {}

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

export const deleteCard = createAsyncThunk('newCard/deleteCard', async (cardId: number) => {
    const apiService = app(APIService);
    try {
        const endpoint = apiService.createEndpoint(`admin/cards/${cardId}`);
        const cardSets = await endpoint.delete('');
        NotificationsService.success('Card Deleted Successfully!');
        return cardSets.data;
    } catch (e: any) {
        NotificationsService.exception(e);
    }
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
    extraReducers(builder) {
        adminCardsThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminCardsAction, showAction: showAdminCardAction } = adminCardsThunk;

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { classToPlain } from 'class-transformer';

import { OrderEntity } from '@shared/entities/OrderEntity';
import { app } from '@shared/lib/app';
import { OrdersRepository } from '@shared/repositories/OrdersRepository';

import { PaginatedData } from '../../classes/PaginatedData';
import { APIState } from '../../types/APIState';
import { serializeDataList } from '../utlis/serializeDataList';

interface StateType extends APIState<OrderEntity> {}

export const listOrdersAction = createAsyncThunk('orders/listOrdersAction', async () => {
    const ordersRepository = app(OrdersRepository);
    const data = await ordersRepository.list();
    return classToPlain(data);
});

export const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        isLoading: false,
        entities: {},
        ids: [],
        pagination: {},
        errors: {},
    } as StateType,
    reducers: {},
    extraReducers: {
        [listOrdersAction.pending as any]: (state) => {
            state.errors.list = null;
            state.isLoading = true;
        },
        [listOrdersAction.rejected as any]: (state, { error }: PayloadAction<void, string, never, Error | string>) => {
            state.errors.list = error;
        },
        [listOrdersAction.fulfilled as any]: (state, { payload }: PayloadAction<PaginatedData<OrderEntity>>) => {
            const { data, meta, links } = payload;
            const { entities, ids } = serializeDataList(data);
            state.ids = [...state.ids, ...ids];
            state.entities = { ...state.entities, ...entities };
            state.pagination.links = links;
            state.pagination.meta = meta;
            state.isLoading = false;
        },
    },
});

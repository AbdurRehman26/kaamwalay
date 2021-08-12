import { createSlice } from '@reduxjs/toolkit';

import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrdersRepository } from '@shared/repositories/OrdersRepository';

import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<OrderEntity> {}

const ordersThunk = createRepositoryThunk('orders', OrdersRepository);

export const ordersSlice = createSlice({
    name: ordersThunk.name,
    initialState: {
        ...ordersThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers: ordersThunk.buildReducers,
});

export const { listAction: listOrdersAction, showAction: showOrderAction } = ordersThunk;

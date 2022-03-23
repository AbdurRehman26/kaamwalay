import { createSlice } from '@reduxjs/toolkit';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrdersRepository } from '@shared/repositories/OrdersRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<OrderEntity> {}

const pendingOrders = createRepositoryThunk('pendingOrders', OrdersRepository);

export const pendingOrdersSlice = createSlice({
    name: pendingOrders.name,
    initialState: {
        ...pendingOrders.initialState,
    } as StateType,
    reducers: {
        invalidateOrders: pendingOrders.invalidateEntities,
    },
    extraReducers(builder) {
        pendingOrders.buildReducers(builder);
    },
});

export const { invalidateOrders } = pendingOrdersSlice.actions;
export const { listAction: listPendingOrdersAction, showAction: showOrderAction } = pendingOrders;

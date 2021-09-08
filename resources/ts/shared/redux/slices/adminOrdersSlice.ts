import { createSlice } from '@reduxjs/toolkit';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { AdminOrdersRepository } from '../../repositories/AdminOrdersRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<OrderEntity> {}

const adminOrdersThunk = createRepositoryThunk('adminOrders', AdminOrdersRepository);

export const adminOrdersSlice = createSlice({
    name: adminOrdersThunk.name,
    initialState: {
        ...adminOrdersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminOrders: adminOrdersThunk.invalidateEntities,
    },
    extraReducers: adminOrdersThunk.buildReducers,
});
export const { invalidateAdminOrders } = adminOrdersSlice.actions;
export const { listAction: listAdminOrdersAction, showAction: showAdminOrderAction } = adminOrdersThunk;

import { createSlice } from '@reduxjs/toolkit';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { AdminOrdersRepository } from '@shared/repositories/Admin/AdminOrdersRepository';
import { APIState } from '@shared/types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<OrderEntity> {}

const adminOrdersListThunk = createRepositoryThunk('adminOrdersList', AdminOrdersRepository);

export const adminOrdersListSlice = createSlice({
    name: 'adminOrdersList',
    initialState: {
        ...adminOrdersListThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminOrders: adminOrdersListThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminOrdersListThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminOrdersListAction, showAction: showAdminOrderShowAction } = adminOrdersListThunk;

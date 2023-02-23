import { createSlice } from '@reduxjs/toolkit';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { ReferralOrdersRepository } from '@shared/repositories/Admin/ReferralOrdersRepository';
import { APIState } from '@shared/types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<OrderEntity> {}

const adminReferralOrdersThunk = createRepositoryThunk('adminReferralOrders', ReferralOrdersRepository);
export const adminReferralOrdersSlice = createSlice({
    name: adminReferralOrdersThunk.name,
    initialState: {
        ...adminReferralOrdersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminReferralOrders: adminReferralOrdersThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminReferralOrdersThunk.buildReducers(builder);
    },
});
export const { invalidateAdminReferralOrders } = adminReferralOrdersSlice.actions;
export const { listAction: listAdminReferralOrdersAction } = adminReferralOrdersThunk;

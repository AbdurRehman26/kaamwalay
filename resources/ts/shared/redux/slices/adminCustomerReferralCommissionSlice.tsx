import { createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { AdminCustomerReferralCommissionRepository } from '@shared/repositories/Admin/AdminCustomerReferralCommissionRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}
const adminCustomersReferralCommissionThunk = createRepositoryThunk(
    'adminCustomerReferralCommission',
    AdminCustomerReferralCommissionRepository,
);

export const adminCustomerReferralCommissionSlice = createSlice({
    name: 'adminCustomerReferralCommission',
    initialState: {
        ...adminCustomersReferralCommissionThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminCustomersReferralCommissionThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminCustomersReferralCommissionAction } = adminCustomersReferralCommissionThunk;

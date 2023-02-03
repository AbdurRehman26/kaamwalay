import { createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { AdminCustomerReferralRepository } from '@shared/repositories/Admin/AdminCustomerReferralRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}
const adminCustomersReferralThunk = createRepositoryThunk('adminCustomersReferral', AdminCustomerReferralRepository);

export const adminCustomerReferralSlice = createSlice({
    name: adminCustomersReferralThunk.name,
    initialState: {
        ...adminCustomersReferralThunk.initialState,
    } as StateType,
    reducers: {},
});

export const {} = adminCustomerReferralSlice.actions;
export const { listAction: listAdminCustomersReferralAction, showAction: showAdminCustomersReferralAction } =
    adminCustomersReferralThunk;

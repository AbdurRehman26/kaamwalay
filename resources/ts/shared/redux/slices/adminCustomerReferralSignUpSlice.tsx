import { createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { AdminCustomerReferralRepository } from '@shared/repositories/Admin/AdminCustomerReferralRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}
const adminCustomersReferralSignUpThunk = createRepositoryThunk(
    'adminCustomersReferralSignUp',
    AdminCustomerReferralRepository,
);

export const adminCustomerReferralSignUpSlice = createSlice({
    name: adminCustomersReferralSignUpThunk.name,
    initialState: {
        ...adminCustomersReferralSignUpThunk.initialState,
    } as StateType,
    reducers: {},
});

export const {} = adminCustomerReferralSignUpSlice.actions;
export const { listAction: listAdminCustomersReferralAction, showAction: showAdminCustomersReferralAction } =
    adminCustomersReferralSignUpThunk;

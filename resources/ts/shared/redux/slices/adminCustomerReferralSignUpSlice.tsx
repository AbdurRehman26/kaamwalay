import { createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { AdminCustomerReferralSignUpRepository } from '@shared/repositories/Admin/AdminCustomerReferralSignUpRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}
const adminCustomersReferralSignUpThunk = createRepositoryThunk(
    'adminCustomerReferralSignUp',
    AdminCustomerReferralSignUpRepository,
);

export const adminCustomerReferralSignUpSlice = createSlice({
    name: 'adminCustomerReferralSignUp',
    initialState: {
        ...adminCustomersReferralSignUpThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminCustomersReferralSignUpThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminCustomersReferralSignUpAction } = adminCustomersReferralSignUpThunk;

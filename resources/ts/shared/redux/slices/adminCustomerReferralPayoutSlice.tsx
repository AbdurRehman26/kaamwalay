import { createSlice } from '@reduxjs/toolkit';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { AdminCustomerReferralPayoutRepository } from '@shared/repositories/Admin/AdminCustomerReferralPayoutRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<PayoutEntity> {}
const adminCustomerReferralPayoutThunk = createRepositoryThunk(
    'adminCustomerReferralPayout',
    AdminCustomerReferralPayoutRepository,
);

export const adminCustomerReferralPayoutSlice = createSlice({
    name: 'adminCustomerReferralPayout',
    initialState: {
        ...adminCustomerReferralPayoutThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminCustomerReferralPayoutThunk.buildReducers(builder);
    },
});

export const { listAction: showAdminCustomersReferralPayoutAction } = adminCustomerReferralPayoutThunk;

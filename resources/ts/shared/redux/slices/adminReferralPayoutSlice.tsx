import { createSlice } from '@reduxjs/toolkit';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { AdminReferralPayoutsRepository } from '@shared/repositories/Admin/AdminReferralPayoutRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<PayoutEntity> {}
const adminReferralPayoutSliceThunk = createRepositoryThunk('adminReferralPayout', AdminReferralPayoutsRepository);

export const adminReferralPayoutSlice = createSlice({
    name: 'adminReferralPayout',
    initialState: {
        ...adminReferralPayoutSliceThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminReferralPayoutSliceThunk.buildReducers(builder);
    },
});

export const { listAction: listAdmineferralPayoutAction } = adminReferralPayoutSliceThunk;

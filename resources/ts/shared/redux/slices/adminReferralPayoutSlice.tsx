import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { app } from '@shared/lib/app';
import { AdminReferralPayoutsRepository } from '@shared/repositories/Admin/AdminReferralPayoutRepository';
import { NotificationsService } from '@shared/services/NotificationsService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<PayoutEntity> {}
const adminReferralPayoutSliceThunk = createRepositoryThunk('adminReferralPayout', AdminReferralPayoutsRepository);

export const payReferralCommissions = createAsyncThunk('payReferralCommissions', async (input: {}, thunkAPI) => {
    const payoutRepository = app(AdminReferralPayoutsRepository);
    try {
        const salesRep: PayoutEntity = await payoutRepository.payReferralCommissions(input);
        NotificationsService.success('Payout request send Successfully!');
        return instanceToPlain(salesRep);
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

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

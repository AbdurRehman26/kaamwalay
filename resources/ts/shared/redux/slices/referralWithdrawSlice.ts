import { createSlice } from '@reduxjs/toolkit';
import { ReferralWithdrawEntity } from '@shared/entities/ReferralWithdrawEntity';
import { ReferralWithdrawRepository } from '@shared/repositories/ReferralWithdrawRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<ReferralWithdrawEntity> {}

const referralWithdrawThunk = createRepositoryThunk('referralWithdraw', ReferralWithdrawRepository);

export const referralWithdrawSlice = createSlice({
    name: referralWithdrawThunk.name,
    initialState: {
        ...referralWithdrawThunk.initialState,
    } as StateType,
    reducers: {
        invalidateReferralWithdraw: referralWithdrawThunk.invalidateEntities,
    },
    extraReducers(builder) {
        referralWithdrawThunk.buildReducers(builder);
    },
});
export const { invalidateReferralWithdraw } = referralWithdrawSlice.actions;
export const { listAction: listReferralWithdrawAction } = referralWithdrawThunk;

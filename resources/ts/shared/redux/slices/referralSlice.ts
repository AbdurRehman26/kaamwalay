import { createSlice } from '@reduxjs/toolkit';
import { ReferrerEntity } from '@shared/entities/ReferrerEntity';
import { ReferralRepository } from '@shared/repositories/ReferralRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<ReferrerEntity> {}

const referralThunk = createRepositoryThunk('referral', ReferralRepository);

export const referralSlice = createSlice({
    name: referralThunk.name,
    initialState: {
        ...referralThunk.initialState,
    } as StateType,
    reducers: {
        invalidateReferral: referralThunk.invalidateEntities,
    },
    extraReducers(builder) {
        referralThunk.buildReducers(builder);
    },
});
export const { invalidateReferral } = referralSlice.actions;
export const { listAction: listReferralAction, showAction: showReferralAction } = referralThunk;

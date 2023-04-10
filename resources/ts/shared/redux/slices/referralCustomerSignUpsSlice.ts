import { createSlice } from '@reduxjs/toolkit';
import { ReferralCustomerSignUpsEntity } from '@shared/entities/ReferralCustomerSignUpsEntity';
import { ReferralCustomerSignUpsRepository } from '@shared/repositories/ReferralCustomerSignUpsRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<ReferralCustomerSignUpsEntity> {}

const referralCustomerSignUpsThunk = createRepositoryThunk(
    'referralCustomerSignUps',
    ReferralCustomerSignUpsRepository,
);

export const referralCustomerSignUpsSlice = createSlice({
    name: referralCustomerSignUpsThunk.name,
    initialState: {
        ...referralCustomerSignUpsThunk.initialState,
    } as StateType,
    reducers: {
        invalidateReferralCustomerSignUps: referralCustomerSignUpsThunk.invalidateEntities,
    },
    extraReducers(builder) {
        referralCustomerSignUpsThunk.buildReducers(builder);
    },
});
export const { invalidateReferralCustomerSignUps } = referralCustomerSignUpsSlice.actions;
export const { listAction: listReferralCustomerSignUpsAction } = referralCustomerSignUpsThunk;

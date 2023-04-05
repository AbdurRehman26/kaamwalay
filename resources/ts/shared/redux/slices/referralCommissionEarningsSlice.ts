import { createSlice } from '@reduxjs/toolkit';
import { ReferralCommissionEarningsEntity } from '@shared/entities/ReferralCommissionEarningsEntity';
import { ReferralCommissionEarningsRepository } from '@shared/repositories/ReferralCommissionEarningsRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<ReferralCommissionEarningsEntity> {}

const referralCommissionEarningsThunk = createRepositoryThunk(
    'referralCommissionEarnings',
    ReferralCommissionEarningsRepository,
);

export const referralCommissionEarningsSlice = createSlice({
    name: referralCommissionEarningsThunk.name,
    initialState: {
        ...referralCommissionEarningsThunk.initialState,
    } as StateType,
    reducers: {
        invalidateReferralCommissionEarnings: referralCommissionEarningsThunk.invalidateEntities,
    },
    extraReducers(builder) {
        referralCommissionEarningsThunk.buildReducers(builder);
    },
});
export const { invalidateReferralCommissionEarnings } = referralCommissionEarningsSlice.actions;
export const { listAction: listReferralCommissionEarningsAction } = referralCommissionEarningsThunk;

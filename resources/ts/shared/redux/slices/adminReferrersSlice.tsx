import { createSlice } from '@reduxjs/toolkit';
import { ReferrersRepository } from '@shared/repositories/Admin/ReferrersRepository';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const adminReferrersThunk = createRepositoryThunk('adminReferrers', ReferrersRepository);

export const adminReferrersSlice = createSlice({
    name: adminReferrersThunk.name,
    initialState: {
        ...adminReferrersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminReferrers: adminReferrersThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminReferrersThunk.buildReducers(builder);
    },
});

export const { invalidateAdminReferrers } = adminReferrersSlice.actions;
export const { listAction: listAdminReferrersAction } = adminReferrersThunk;

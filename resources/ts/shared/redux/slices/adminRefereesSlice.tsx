import { createSlice } from '@reduxjs/toolkit';
import { RefereesRepository } from '@shared/repositories/Admin/RefereesRepository';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const adminRefereesThunk = createRepositoryThunk('adminReferees', RefereesRepository);

export const adminRefereesSlice = createSlice({
    name: adminRefereesThunk.name,
    initialState: {
        ...adminRefereesThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminReferees: adminRefereesThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminRefereesThunk.buildReducers(builder);
    },
});

export const { invalidateAdminReferees } = adminRefereesSlice.actions;
export const { listAction: listAdminRefereesAction, showAction: showAdminCustomerAction } = adminRefereesThunk;

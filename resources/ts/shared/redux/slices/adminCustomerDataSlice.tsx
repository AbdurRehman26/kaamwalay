import { createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { CustomerDataRepository } from '../../repositories/Admin/CustomerDataRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const adminCustomerDataThunk = createRepositoryThunk('adminCustomerData', CustomerDataRepository);

export const adminCustomerDataSlice = createSlice({
    name: adminCustomerDataThunk.name,
    initialState: {
        ...adminCustomerDataThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminCustomerData: adminCustomerDataThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminCustomerDataThunk.buildReducers(builder);
    },
});

export const { invalidateAdminCustomerData } = adminCustomerDataSlice.actions;
export const { listAction: listAdminCustomerDataAction, showAction: showAdminCustomerDataAction } =
    adminCustomerDataThunk;

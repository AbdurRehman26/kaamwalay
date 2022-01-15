import { createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { CustomersRepository } from '../../repositories/Admin/CustomersRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const adminCustomersThunk = createRepositoryThunk('adminCustomers', CustomersRepository);

export const adminCustomersSlice = createSlice({
    name: adminCustomersThunk.name,
    initialState: {
        ...adminCustomersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminCustomers: adminCustomersThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminCustomersThunk.buildReducers(builder);
    },
});

export const { invalidateAdminCustomers } = adminCustomersSlice.actions;
export const { listAction: listAdminCustomersAction, showAction: showAdminCustomerAction } = adminCustomersThunk;

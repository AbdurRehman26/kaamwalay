import { createSlice } from '@reduxjs/toolkit';
import { UserEntity } from '../../entities/UserEntity';
import { CustomerRepository } from '../../repositories/Admin/CustomerRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<UserEntity> {}

const adminCustomerThunk = createRepositoryThunk('adminCustomer', CustomerRepository);

export const adminCustomerSlice = createSlice({
    name: adminCustomerThunk.name,
    initialState: {
        ...adminCustomerThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminCustomer: adminCustomerThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminCustomerThunk.buildReducers(builder);
    },
});

export const { invalidateAdminCustomer } = adminCustomerSlice.actions;
export const { listAction: listAdminCustomerAction, showAction: showAdminCustomerAction } = adminCustomerThunk;

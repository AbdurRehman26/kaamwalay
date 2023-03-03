import { createSlice } from '@reduxjs/toolkit';
import { AdminCustomersRepository } from '@shared/repositories/Admin/AdminCustomersRepository';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const adminCustomersListThunk = createRepositoryThunk('adminCustomersList', AdminCustomersRepository);

export const adminCustomersListSlice = createSlice({
    name: 'adminCustomersList',
    initialState: {
        ...adminCustomersListThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminCustomers: adminCustomersListThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminCustomersListThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminCustomersListAction, showAction: showAdminCustomerShowAction } =
    adminCustomersListThunk;

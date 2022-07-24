import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { NotificationsService } from '@shared/services/NotificationsService';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { CustomersRepository } from '../../repositories/Admin/CustomersRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const adminCustomersThunk = createRepositoryThunk('adminCustomers', CustomersRepository);

export const storeCustomer = createAsyncThunk('storeCustomer', async (input: CustomerEntity, thunkAPI) => {
    const customersRepository = app(CustomersRepository);

    try {
        await customersRepository.storeCustomer(input);
        NotificationsService.success('Order cancelled successfully!');
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

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

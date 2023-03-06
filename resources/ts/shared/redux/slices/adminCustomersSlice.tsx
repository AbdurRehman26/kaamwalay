import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { AddCustomerRequestDto } from '@shared/dto/AddCustomerRequestDto';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { app } from '@shared/lib/app';
import { NotificationsService } from '@shared/services/NotificationsService';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { CustomersRepository } from '../../repositories/Admin/CustomersRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const adminCustomersThunk = createRepositoryThunk('adminCustomers', CustomersRepository);

export const storeCustomer = createAsyncThunk('storeCustomer', async (input: AddCustomerRequestDto, thunkAPI) => {
    const customersRepository = app(CustomersRepository);

    try {
        const customer: CustomerEntity = await customersRepository.storeCustomer(input);
        NotificationsService.success('Customer added successfully!');
        return instanceToPlain(customer);
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const assignSalesRep = createAsyncThunk(
    'assignSalesRep',
    async (input: { userId: number; salesmanId: number }, thunkAPI) => {
        const customersRepository = app(CustomersRepository);

        try {
            const customer: SalesRepEntity = await customersRepository.assignSalesRep(input.userId, input.salesmanId);
            NotificationsService.success('Salesrep assigned successfully!');
            return instanceToPlain(customer);
        } catch (e: any) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const unAssignSalesRep = createAsyncThunk('unAssignSalesRep', async (input: { userId: number }, thunkAPI) => {
    const customersRepository = app(CustomersRepository);

    try {
        const customer: SalesRepEntity = await customersRepository.unAssignSalesRep(input.userId);
        NotificationsService.success('Salesrep unassigned successfully!');
        return instanceToPlain(customer);
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

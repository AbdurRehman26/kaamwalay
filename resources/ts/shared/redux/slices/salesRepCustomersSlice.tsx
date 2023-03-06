import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { AddCustomerRequestDto } from '@shared/dto/AddCustomerRequestDto';
import { app } from '@shared/lib/app';
import { NotificationsService } from '@shared/services/NotificationsService';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { CustomersRepository } from '../../repositories/SalesRep/CustomersRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const salesRepCustomersThunk = createRepositoryThunk('salesRepCustomers', CustomersRepository);

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

export const salesRepCustomersSlice = createSlice({
    name: salesRepCustomersThunk.name,
    initialState: {
        ...salesRepCustomersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateSalesRepCustomers: salesRepCustomersThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        salesRepCustomersThunk.buildReducers(builder);
    },
});

export const { listAction: listSalesRepCustomersAction, showAction: showSalesRepCustomerAction } =
    salesRepCustomersThunk;

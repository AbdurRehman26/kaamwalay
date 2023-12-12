import { createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { CustomersRepository } from '../../repositories/CustomersRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}

const customersThunk = createRepositoryThunk('customers', CustomersRepository);

export const customersSlice = createSlice({
    name: customersThunk.name,
    initialState: {
        ...customersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateSalesRepCustomers: customersThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        customersThunk.buildReducers(builder);
    },
});

export const { listAction: listCustomerCustomersAction } = customersThunk;

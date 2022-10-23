import { createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { SalesMenRepository } from '@shared/repositories/Admin/SalesMenRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}
const adminSalesMenThunk = createRepositoryThunk('adminSalesMen', SalesMenRepository);

export const adminSalesMenSlice = createSlice({
    name: adminSalesMenThunk.name,
    initialState: {
        ...adminSalesMenThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminSalesMenThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminSalesMenAction, showAction: showAdminSalesMenAction } = adminSalesMenThunk;

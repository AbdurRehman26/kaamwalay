import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { AddSalesRepRequestDto } from '@shared/dto/AddSalesRepRequestDto';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { app } from '@shared/lib/app';
import { SalesRepRepository } from '@shared/repositories/Admin/SalesRepRepository';
import { NotificationsService } from '@shared/services/NotificationsService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<SalesRepEntity> {}
const adminSalesMenThunk = createRepositoryThunk('adminSalesMen', SalesRepRepository);

export const storeSalesRep = createAsyncThunk('storeCustomer', async (input: AddSalesRepRequestDto, thunkAPI) => {
    const salesRepRepository = app(SalesRepRepository);
    try {
        const salesRep: SalesRepEntity = await salesRepRepository.storeSalesRep(input);
        NotificationsService.success('Salesrep added successfully!');
        return instanceToPlain(salesRep);
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const getSalesRep = createAsyncThunk('getSalesRep', async () => {
    const salesRepRepository = app(SalesRepRepository);
    try {
        const salesReps: SalesRepEntity = await salesRepRepository.getSalesRep();
        return instanceToPlain(salesReps);
    } catch (e: any) {
        NotificationsService.exception(e);
    }
});

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

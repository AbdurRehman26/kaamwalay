import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { AddSalesRepRequestDto } from '@shared/dto/AddSalesRepRequestDto';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { app } from '@shared/lib/app';
import { SalesRepRepository } from '@shared/repositories/Admin/SalesRepRepository';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<SalesRepEntity> {}
const adminSalesRepThunk = createRepositoryThunk('adminSalesRep', SalesRepRepository);

export const storeSalesRep = createAsyncThunk('storeSalesRep', async (input: AddSalesRepRequestDto, thunkAPI) => {
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

export const getSalesReps = createAsyncThunk('getSalesRep', async () => {
    const salesRepRepository = app(SalesRepRepository);
    try {
        const salesReps: SalesRepEntity = await salesRepRepository.getSalesReps();
        return instanceToPlain(salesReps);
    } catch (e: any) {
        NotificationsService.exception(e);
    }
});

export const addExistingUserAsSalesRep = createAsyncThunk(
    'addExistingUserAsSalesRep',
    async (input: { userId: number | undefined; salesRep: AddSalesRepRequestDto }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/salesman/${input.userId}/assign-salesman-role`);
        const response = await endpoint.post('', input.salesRep);
        return response.data;
    },
);

export const adminSalesRepSlice = createSlice({
    name: adminSalesRepThunk.name,
    initialState: {
        ...adminSalesRepThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminSalesRepThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminSalesRepAction, showAction: showAdminSalesRepAction } = adminSalesRepThunk;

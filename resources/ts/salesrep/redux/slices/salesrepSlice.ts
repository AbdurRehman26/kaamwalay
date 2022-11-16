import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

export const getAllSalesRep = createAsyncThunk('salesRep/getAllSalesRep', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`admin/salesmen`);
    const salesRef = await endpoint.get('');
    return salesRef.data;
});

export const getSales = createAsyncThunk('salesRep/getSales', async (input: { salesmanId: number }) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`salesman/dashboard/sales`);
    const sales = await endpoint.get('');
    return sales.data.data ?? sales.data;
});

export const getCommissionsEarned = createAsyncThunk(
    'salesRep/getCommissionsEarned',
    async (input: { salesmanId: number }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`salesman/dashboard/commission-earned`);
        const commission = await endpoint.get('');
        return commission.data.data ?? commission.data;
    },
);

const initialState = {
    salesReps: [],
    commission: 0,
    sales: 0,
};

export const salesRepSlice = createSlice({
    name: 'salesRep',
    initialState,
    reducers: {},
    extraReducers: {
        [getAllSalesRep.fulfilled as any]: (state, action) => {
            state.salesReps = action.payload;
        },
        [getSales.fulfilled as any]: (state, action) => {
            state.sales = action.payload;
        },
        [getCommissionsEarned.fulfilled as any]: (state, action) => {
            state.commission = action.payload;
        },
    },
});
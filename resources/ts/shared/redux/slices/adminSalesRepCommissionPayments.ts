import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { AddCommissionPaymentDto } from '@shared/dto/AddCommissionPaymentDto';
import { SalesRepCommissionPaymentsEntity } from '@shared/entities/SalesRepCommissionPaymentsEntity';
import { app } from '@shared/lib/app';
import { AdminSalesRepCommissionPaymentRepository } from '@shared/repositories/Admin/AdminSalesRepCommissionPaymentRepository';
import { NotificationsService } from '@shared/services/NotificationsService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<SalesRepCommissionPaymentsEntity> {
    adminSalesRepCommissionPayment: SalesRepCommissionPaymentsEntity;
}

const adminSalesRepCommissionsThunk = createRepositoryThunk(
    'adminSalesRepCommissionPayments',
    AdminSalesRepCommissionPaymentRepository,
);

export const storeSalesRepCommissionPayment = createAsyncThunk(
    'storeSalesRepCommissionPayment',
    async (input: AddCommissionPaymentDto, thunkAPI) => {
        const salesRepCommissionPaymentsRepository = app(AdminSalesRepCommissionPaymentRepository);
        try {
            const commission: SalesRepCommissionPaymentsEntity =
                await salesRepCommissionPaymentsRepository.storeCommission(input);
            NotificationsService.success('Commission created successfully!');
            return instanceToPlain(commission);
        } catch (e: any) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const adminSalesRepCommissionPaymentsSlice = createSlice({
    name: adminSalesRepCommissionsThunk.name,
    initialState: {
        ...adminSalesRepCommissionsThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminSalesRepCommissionsThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminSalesRepCommissionPaymentsAction } = adminSalesRepCommissionsThunk;

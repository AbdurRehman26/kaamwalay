import { createSlice } from '@reduxjs/toolkit';
import { SalesRepCommissionPaymentsEntity } from '@shared/entities/SalesRepCommissionPaymentsEntity';
import { SalesRepCommissionPaymentsRepository } from '@shared/repositories/SalesRep/SalesRepCommissionPaymentRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<SalesRepCommissionPaymentsEntity> {
    salesRepCommissionPayment: SalesRepCommissionPaymentsEntity;
}

const salesRepCommissionsThunk = createRepositoryThunk(
    'salesRepCommissionPayments',
    SalesRepCommissionPaymentsRepository,
);

export const salesRepCommissionPaymentsSlice = createSlice({
    name: salesRepCommissionsThunk.name,
    initialState: {
        ...salesRepCommissionsThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        salesRepCommissionsThunk.buildReducers(builder);
    },
});

export const { listAction: listSalesRepCommissionPaymentsAction } = salesRepCommissionsThunk;

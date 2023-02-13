import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { app } from '@shared/lib/app';
import { AdminCustomerReferralCommissionRepository } from '@shared/repositories/Admin/AdminCustomerReferralCommissionRepository';
import { APIService } from '@shared/services/APIService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CustomerEntity> {}
const adminCustomersReferralCommissionThunk = createRepositoryThunk(
    'adminCustomerReferralCommission',
    AdminCustomerReferralCommissionRepository,
);

export const changeReferralStatus = createAsyncThunk(
    'referral/changeReferralStatus',
    async (DTO: { customerId: number; referralStatus: boolean }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/customer/${DTO.customerId}/referral/set-referrers-status`, {
            version: 'v3',
        });
        const referral = await endpoint.post('', {
            isReferralActive: DTO.referralStatus,
        });
        return referral.data;
    },
);

export const adminCustomerReferralCommissionSlice = createSlice({
    name: 'adminCustomerReferralCommission',
    initialState: {
        ...adminCustomersReferralCommissionThunk.initialState,
    } as StateType,
    reducers: {},
    extraReducers(builder) {
        adminCustomersReferralCommissionThunk.buildReducers(builder);
    },
});

export const { listAction: listAdminCustomersReferralCommissionAction } = adminCustomersReferralCommissionThunk;

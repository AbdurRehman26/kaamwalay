import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReferrerEntity } from '@shared/entities/ReferrerEntity';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

export interface ReferrerDetail {
    referrer: ReferrerEntity;
}

export interface CustomerSignUpsFilter {
    signUpsfilter: boolean;
}

export interface CommissionEarningsFilter {
    commissionEarningFilter: boolean;
}

export interface WithdrawSort {
    withdraw: boolean;
}

export interface referralProgramSliceState {
    referrerDetail: ReferrerDetail;
    customerSignUpsFilter: CustomerSignUpsFilter;
    commissionEarningsFilter: CommissionEarningsFilter;
    withdrawSort: WithdrawSort;
}

const initialState: referralProgramSliceState = {
    referrerDetail: {
        referrer: {} as ReferrerEntity,
    },
    customerSignUpsFilter: {
        signUpsfilter: false,
    },
    commissionEarningsFilter: {
        commissionEarningFilter: false,
    },
    withdrawSort: {
        withdraw: false,
    },
};

export const getReferrerDetail = createAsyncThunk('referrer/getReferrerDetail', async () => {
    try {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint('customer/referral', { version: 'v3' });
        const referrer = await endpoint.get('');
        return referrer.data.referrer;
    } catch (e: any) {
        NotificationsService.exception(e);
    }
});

export const referralProgramSlice = createSlice({
    name: 'referralProgramSlice',
    initialState,
    reducers: {
        setCustomerSignUpsFilter: (state, action: PayloadAction<boolean>) => {
            state.customerSignUpsFilter.signUpsfilter = action.payload;
        },
        setCommissionEarningsFilter: (state, action: PayloadAction<boolean>) => {
            state.commissionEarningsFilter.commissionEarningFilter = action.payload;
        },
        setWithdrawSort: (state, action: PayloadAction<boolean>) => {
            state.withdrawSort.withdraw = action.payload;
        },
    },
    extraReducers: {
        [getReferrerDetail.fulfilled as any]: (state, action) => {
            state.referrerDetail.referrer = action.payload;
        },
    },
});

export const { setCustomerSignUpsFilter, setCommissionEarningsFilter, setWithdrawSort } = referralProgramSlice.actions;

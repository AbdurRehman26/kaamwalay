import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReferrerEntity } from '@shared/entities/ReferrerEntity';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

export interface ReferrerDetail {
    referrer: ReferrerEntity;
}

export interface CustomerSignUpsSort {
    signUpsSort: boolean;
}

export interface CommissionEarningsSort {
    commissionEarningSort: boolean;
}
export interface WithdrawSort {
    withdraw: boolean;
}

export interface referralProgramSliceState {
    referrerDetail: ReferrerDetail;
    customerSignUpsSort: CustomerSignUpsSort;
    commissionEarningsSort: CommissionEarningsSort;
    withdrawSort: WithdrawSort;
}

const initialState: referralProgramSliceState = {
    referrerDetail: {
        referrer: {} as ReferrerEntity,
    },
    customerSignUpsSort: {
        signUpsSort: false,
    },
    commissionEarningsSort: {
        commissionEarningSort: false,
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
        setCustomerSignUpsSort: (state, action: PayloadAction<boolean>) => {
            state.customerSignUpsSort.signUpsSort = action.payload;
        },
        setCommissionEarningsSort: (state, action: PayloadAction<boolean>) => {
            state.commissionEarningsSort.commissionEarningSort = action.payload;
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

export const { setCustomerSignUpsSort, setCommissionEarningsSort, setWithdrawSort } = referralProgramSlice.actions;

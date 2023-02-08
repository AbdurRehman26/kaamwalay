import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReferrerEntity } from '@shared/entities/ReferrerEntity';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

export interface ReferrerDetail {
    referrer: ReferrerEntity;
}

export interface referralProgramSliceState {
    referrerDetail: ReferrerDetail;
}

const initialState: referralProgramSliceState = {
    referrerDetail: {
        referrer: {} as ReferrerEntity,
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
    reducers: {},
    extraReducers: {
        [getReferrerDetail.fulfilled as any]: (state, action) => {
            state.referrerDetail.referrer = action.payload;
        },
    },
});

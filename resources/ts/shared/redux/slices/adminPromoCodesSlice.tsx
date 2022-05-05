import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { app } from '@shared/lib/app';
import {
    clearNewPromoCodeState,
    setIsTableLoading,
    setShowNewPromoCodeDialog,
} from '@shared/redux/slices/adminNewPromoCodeSlice';
import { AdminPromoCodesRepository } from '@shared/repositories/Admin/PromoCodesRepository';
import { NotificationsService } from '@shared/services/NotificationsService';
import { APIState } from '@shared/types/APIState';
import { StoreCouponDto } from '../../dto/StoreCouponDto';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<PromoCodeEntity> {}

const adminPromoCodesThunk = createRepositoryThunk('adminPromoCodes', AdminPromoCodesRepository);

export const changePromoCodeStatus = createAsyncThunk(
    'changePromoCodeStatus',
    async (input: { promoCodeID: number; newStatus: number }, thunkAPI) => {
        const promoCodesRepository = app(AdminPromoCodesRepository);
        try {
            thunkAPI.dispatch(setIsTableLoading(true));
            const newStatusResponse = await promoCodesRepository.changePromoCodeStatus(input);
            NotificationsService.success('Promo Code Updated!');
            thunkAPI.dispatch(setIsTableLoading(false));
            return newStatusResponse.data;
        } catch (e: any) {
            NotificationsService.exception(e);
            thunkAPI.dispatch(setIsTableLoading(false));
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const deletePromoCode = createAsyncThunk('deletePromoCode', async (input: { promoCodeID: number }, thunkAPI) => {
    const promoCodesRepository = app(AdminPromoCodesRepository);
    try {
        thunkAPI.dispatch(setIsTableLoading(true));
        await promoCodesRepository.deletePromoCode(input);
        NotificationsService.success('Promo Code Deleted');
        thunkAPI.dispatch(setIsTableLoading(false));
        return input as any;
    } catch (e: any) {
        NotificationsService.exception(e);
        thunkAPI.dispatch(setIsTableLoading(false));
        return thunkAPI.rejectWithValue(e);
    }
});

export const storeCoupon = createAsyncThunk('storeCoupon', async (input: StoreCouponDto, thunkAPI) => {
    const promoCodesRepository = app(AdminPromoCodesRepository);
    try {
        thunkAPI.dispatch(setIsTableLoading(true));
        const newCoupon = await promoCodesRepository.storeCoupon(input);
        NotificationsService.success('Promo Code Created!');
        thunkAPI.dispatch(setShowNewPromoCodeDialog(false));
        thunkAPI.dispatch(clearNewPromoCodeState());
        thunkAPI.dispatch(setIsTableLoading(false));
        return newCoupon as any;
    } catch (e: any) {
        NotificationsService.exception(e);
        thunkAPI.dispatch(setIsTableLoading(false));
        return thunkAPI.rejectWithValue(e);
    }
});

export const adminPromoCodesSlice = createSlice({
    name: adminPromoCodesThunk.name,
    initialState: {
        ...adminPromoCodesThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminPromoCodes: adminPromoCodesThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminPromoCodesThunk.buildReducers(builder);

        builder.addCase(changePromoCodeStatus.fulfilled, (state, { payload }) => {
            if (state.entities[payload.promoCodeID]) {
                state.entities[payload.promoCodeID].couponStatus = payload.couponStatus;
            }
        });

        builder.addCase(deletePromoCode.fulfilled, (state, { payload }) => {
            if (state.entities[payload.promoCodeID]) {
                state.ids = state.ids.filter((id) => id !== payload.promoCodeID);
                delete state.entities[payload.promoCodeID];
            }
        });

        builder.addCase(storeCoupon.fulfilled, (state, { payload }) => {
            console.log(payload, 'created!');
        });
    },
});

export const { invalidateAdminPromoCodes } = adminPromoCodesSlice.actions;
export const { listAction: listAdminPromoCodesAction, showAction: showAdminPromoCodeAction } = adminPromoCodesThunk;

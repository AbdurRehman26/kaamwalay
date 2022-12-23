import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { app } from '@shared/lib/app';
import {
    clearNewPromoCodeState,
    setIsTableLoading,
    setShowNewPromoCodeDialog,
} from '@shared/redux/slices/salesmanNewPromoCodeSlice';
import { SalesmanPromoCodesRepository } from '@shared/repositories/SalesRep/PromoCodesRepository';
import { NotificationsService } from '@shared/services/NotificationsService';
import { APIState } from '@shared/types/APIState';
import { StoreCouponDto } from '../../dto/StoreCouponDto';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<PromoCodeEntity> {}

const salesmanPromoCodesThunk = createRepositoryThunk('salesmanPromoCodes', SalesmanPromoCodesRepository);

export const getPromoCodes = createAsyncThunk('getPromoCodes', async (search: string) => {
    const promoCodesRepository = app(SalesmanPromoCodesRepository);
    try {
        const promoCodes = await promoCodesRepository.getPromoCodes(search);
        return promoCodes;
    } catch (e: any) {
        NotificationsService.exception(e);
    }
});

export const changePromoCodeStatus = createAsyncThunk(
    'changePromoCodeStatus',
    async (input: { promoCodeID: number; newStatus: number }, thunkAPI) => {
        const promoCodesRepository = app(SalesmanPromoCodesRepository);
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
    const promoCodesRepository = app(SalesmanPromoCodesRepository);
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
    const promoCodesRepository = app(SalesmanPromoCodesRepository);
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

export const salesmanPromoCodesSlice = createSlice({
    name: salesmanPromoCodesThunk.name,
    initialState: {
        ...salesmanPromoCodesThunk.initialState,
    } as StateType,
    reducers: {
        invalidateSalesmanPromoCodes: salesmanPromoCodesThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        salesmanPromoCodesThunk.buildReducers(builder);

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

export const { invalidateSalesmanPromoCodes } = salesmanPromoCodesSlice.actions;
export const { listAction: listSalesmanPromoCodesAction, showAction: showSalesmanPromoCodeAction } =
    salesmanPromoCodesThunk;

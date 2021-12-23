import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { APIState } from '@shared/types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';
import { AdminPromoCodesRepository } from '@shared/repositories/Admin/PromoCodesRepository';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { app } from '@shared/lib/app';
import { NotificationsService } from '@shared/services/NotificationsService';
import { StoreCouponDTO } from '@shared/dto/StoreCouponDTO';
import { clearNewPromoCodeState, setShowNewPromoCodeDialog } from '@shared/redux/slices/adminNewPromoCodeSlice';

interface StateType extends APIState<PromoCodeEntity> {}

const adminPromoCodesThunk = createRepositoryThunk('adminPromoCodes', AdminPromoCodesRepository);

export const changePromoCodeStatus = createAsyncThunk(
    'changePromoCodeStatus',
    async (input: { promoCodeID: number; newStatus: number }, thunkAPI) => {
        const promoCodesRepository = app(AdminPromoCodesRepository);
        try {
            const newStatusResponse = await promoCodesRepository.changePromoCodeStatus(input);
            NotificationsService.success('Promo Code Updated!');
            window.location.reload();
            return newStatusResponse.data;
        } catch (e: any) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const deletePromoCode = createAsyncThunk('deletePromoCode', async (input: { promoCodeID: number }, thunkAPI) => {
    const promoCodesRepository = app(AdminPromoCodesRepository);
    try {
        await promoCodesRepository.deletePromoCode(input);
        NotificationsService.success('Promo Code Deleted');
        window.location.reload();
        return input as any;
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const storeCoupon = createAsyncThunk('storeCoupon', async (input: StoreCouponDTO, thunkAPI) => {
    const promoCodesRepository = app(AdminPromoCodesRepository);
    try {
        const newCoupon = await promoCodesRepository.storeCoupon(input);
        NotificationsService.success('Promo Code Created!');
        thunkAPI.dispatch(setShowNewPromoCodeDialog(false));
        thunkAPI.dispatch(clearNewPromoCodeState());
        window.location.reload();
        return newCoupon as any;
    } catch (e: any) {
        NotificationsService.exception(e);
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

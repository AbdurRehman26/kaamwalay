import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { APIState } from '@shared/types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';
import { AdminPromoCodesRepository } from '@shared/repositories/Admin/PromoCodesRepository';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { app } from '@shared/lib/app';
import { NotificationsService } from '@shared/services/NotificationsService';
import { PromoCodeStatusEnum } from '@shared/constants/PromoCodeStatusEnum';

interface StateType extends APIState<PromoCodeEntity> {}

const adminPromoCodesThunk = createRepositoryThunk('adminPromoCodes', AdminPromoCodesRepository);

export const deactivatePromoCode = createAsyncThunk(
    'deactivatePromoCode',
    async (input: { promoCodeID: number }, thunkAPI) => {
        const promoCodesRepository = app(AdminPromoCodesRepository);
        try {
            await promoCodesRepository.deactivatePromoCode(input);
            NotificationsService.success('Promo Code Deactivated');
            return input as any;
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
        return input as any;
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

        builder.addCase(deactivatePromoCode.fulfilled, (state, { payload }) => {
            if (state.entities[payload.promoCodeID]) {
                state.entities[payload.promoCodeID].status = PromoCodeStatusEnum.INACTIVE;
            }
        });

        builder.addCase(deletePromoCode.fulfilled, (state, { payload }) => {
            if (state.entities[payload.promoCodeID]) {
                state.ids = state.ids.filter((id) => id !== payload.promoCodeID);
                delete state.entities[payload.promoCodeID];
            }
        });
    },
});

export const { invalidateAdminPromoCodes } = adminPromoCodesSlice.actions;
export const { listAction: listAdminPromoCodesAction, showAction: showAdminPromoCodeAction } = adminPromoCodesThunk;

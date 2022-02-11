import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { ManageCardDialogViewEnum } from '../../constants/ManageCardDialogViewEnum';
import { CardProductEntity } from '../../entities/CardProductEntity';
import { CardSeriesEntity } from '@shared/entities/CardSeriesEntity';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { CardSetEntity } from '@shared/entities/CardSetEntity';

interface ManageCardDialogState {
    open: boolean;
    declaredValue: number;
    orderItemId?: number | null;
    view: ManageCardDialogViewEnum;
    lastView: ManageCardDialogViewEnum | null;
    selectedCard: CardProductEntity | null;
    selectedCardSeries: CardSeriesEntity | null;
    selectedCardSet: CardSetEntity | null;
    selectedCategory?: CardCategoryEntity | null;

    backup: Omit<ManageCardDialogState, 'view' | 'open' | 'backup' | 'lastView'> | null;
}

export const manageCardDialogSlice = createSlice({
    name: 'manageCardDialog',
    initialState: {
        open: false,
        selectedCard: null,
        selectedCardSeries: null,
        selectedCardSet: null,
        selectedCategory: null,
        declaredValue: 0,
        view: ManageCardDialogViewEnum.List,
        lastView: null,
        backup: null,
    } as ManageCardDialogState,
    reducers: {
        setOpen(state, { payload }: PayloadAction<boolean>) {
            state.open = payload;
            if (!payload) {
                state.backup = null;
                state.view = 1;
                state.lastView = null;
                state.selectedCard = null;
                state.selectedCardSeries = null;
                state.selectedCardSet = null;
                state.selectedCategory = null;
                state.declaredValue = 0;
                state.orderItemId = null;
            }
        },
        setView(state, { payload }: PayloadAction<ManageCardDialogViewEnum>) {
            state.lastView = state.view;
            state.view = payload;
        },
        setSelectedCategory(state, { payload }: PayloadAction<CardCategoryEntity>) {
            state.selectedCategory = instanceToPlain(payload) as any;
        },
        setSelectedCard(state, { payload }: PayloadAction<CardProductEntity | null>) {
            state.selectedCard = instanceToPlain(payload) as any;
        },
        setSelectedCardSeries(state, { payload }: PayloadAction<CardSeriesEntity | null>) {
            state.selectedCardSeries = instanceToPlain(payload) as any;
        },
        setSelectedCardSet(state, { payload }: PayloadAction<CardSetEntity | null>) {
            state.selectedCardSet = instanceToPlain(payload) as any;
        },
        navigateToPreviousView(state) {
            state.view = state.lastView || ManageCardDialogViewEnum.View;
        },
        backup(state) {
            if (!state.backup) {
                state.backup = {
                    selectedCard: state.selectedCard,
                    selectedCardSeries: state.selectedCardSeries,
                    selectedCardSet: state.selectedCardSet,
                    selectedCategory: state.selectedCategory,
                    declaredValue: state.declaredValue,
                    orderItemId: state.orderItemId,
                };
            }
        },
        restore(state) {
            if (state.backup) {
                state.selectedCard = state.backup.selectedCard;
                state.selectedCardSeries = state.backup.selectedCardSeries;
                state.selectedCardSet = state.backup.selectedCardSet;
                state.selectedCategory = state.backup.selectedCategory;
                state.declaredValue = state.backup.declaredValue;
                state.orderItemId = state.backup.orderItemId;
                state.backup = null;
            }
        },
        editCard(
            state,
            {
                payload,
            }: PayloadAction<{
                card: CardProductEntity;
                declaredValue: number;
                orderItemId: number;
            }>,
        ) {
            state.open = true;
            state.view = ManageCardDialogViewEnum.Edit;
            state.declaredValue = payload.declaredValue;
            state.orderItemId = payload.orderItemId;
            state.selectedCard = instanceToPlain(payload.card) as any;
        },
    },
});

export const manageCardDialogActions = manageCardDialogSlice.actions;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { classToPlain } from 'class-transformer';
import { ManageCardDialogViewEnum } from '../../constants/ManageCardDialogViewEnum';
import { CardProductEntity } from '../../entities/CardProductEntity';

interface ManageCardDialogState {
    open: boolean;
    declaredValue: number;
    orderItemId?: number | null;
    view: ManageCardDialogViewEnum;
    lastView: ManageCardDialogViewEnum | null;
    selectedCard: CardProductEntity | null;

    backup: Omit<ManageCardDialogState, 'view' | 'open' | 'backup' | 'lastView'> | null;
}

export const manageCardDialogSlice = createSlice({
    name: 'manageCardDialog',
    initialState: {
        open: false,
        selectedCard: null,
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
                state.lastView = null;
                state.selectedCard = null;
                state.declaredValue = 0;
                state.orderItemId = null;
            }
        },
        setView(state, { payload }: PayloadAction<ManageCardDialogViewEnum>) {
            state.lastView = state.view;
            state.view = payload;
        },
        setSelectedCard(state, { payload }: PayloadAction<CardProductEntity | null>) {
            state.selectedCard = classToPlain(payload) as any;
        },
        navigateToPreviousView(state) {
            state.view = state.lastView || ManageCardDialogViewEnum.View;
        },
        backup(state) {
            if (!state.backup) {
                state.backup = {
                    selectedCard: state.selectedCard,
                    declaredValue: state.declaredValue,
                    orderItemId: state.orderItemId,
                };
            }
        },
        restore(state) {
            if (state.backup) {
                state.selectedCard = state.backup.selectedCard;
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
            state.selectedCard = classToPlain(payload.card) as any;
        },
    },
});

export const manageCardDialogActions = manageCardDialogSlice.actions;

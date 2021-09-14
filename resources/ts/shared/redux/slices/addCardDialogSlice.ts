import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { classToPlain } from 'class-transformer';
import { AddCardDialogViewEnum } from '../../constants/AddCardDialogViewEnum';
import { CardProductEntity } from '../../entities/CardProductEntity';

interface AddCardDialogState {
    open: boolean;
    view: AddCardDialogViewEnum;
    selectedCard: CardProductEntity | null;
}

export const addCardDialogSlice = createSlice({
    name: 'addCardDialog',
    initialState: {
        open: false,
        selectedCard: null,
        view: AddCardDialogViewEnum.List,
    } as AddCardDialogState,
    reducers: {
        setAddCardDialogState(state, { payload }: PayloadAction<boolean>) {
            state.open = payload;
        },
        setAddCardDialogView(state, { payload }: PayloadAction<AddCardDialogViewEnum>) {
            state.view = payload;
        },
        selectAddCardDialog(state, { payload }: PayloadAction<CardProductEntity | null>) {
            state.selectedCard = classToPlain(payload) as any;
        },
    },
});

export const { setAddCardDialogState, setAddCardDialogView, selectAddCardDialog } = addCardDialogSlice.actions;

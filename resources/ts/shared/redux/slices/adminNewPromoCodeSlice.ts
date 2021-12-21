import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiscountTypeEnums } from '@shared/constants/DiscountTypeEnums';
import { DiscountApplicationEnums } from '@shared/constants/DiscountApplicationEnum';
import { DiscountDateTypeEnum } from '@shared/constants/DiscountDateTypeEnum';

export interface NewPromoCodeDialogState {
    showNewPromoCodeDialog: boolean;
    modalTitle: string;
    promoCode: string;
    availableApplicationServiceLevels?: {
        value: string;
        id: number;
    }[];
    discountType: DiscountTypeEnums;
    discountApplicationType: DiscountApplicationEnums;
    selectedDiscountApplicationServiceLevelsIds: number[];
    flatDiscountValue?: string;
    percentOffValue?: string;
    discountStartDate?: string;
    discountEndDate?: string;
    discountDateType: DiscountDateTypeEnum;
}

const initialState: NewPromoCodeDialogState = {
    showNewPromoCodeDialog: false,
    modalTitle: 'Create New Promo Code',
    promoCode: '',
    flatDiscountValue: '',
    percentOffValue: '',
    discountStartDate: '',
    discountEndDate: '',
    availableApplicationServiceLevels: [
        {
            id: 2,
            value: '50',
        },
        {
            id: 22,
            value: '60',
        },
        {
            id: 3,
            value: '80',
        },
        {
            id: 8,
            value: '50',
        },
        {
            id: 231,
            value: '55',
        },
        {
            id: 111,
            value: '332',
        },
        {
            id: 664,
            value: '112',
        },
        {
            id: 4411,
            value: '23',
        },
    ],
    selectedDiscountApplicationServiceLevelsIds: [-2],
    discountType: DiscountTypeEnums.percentOff,
    discountApplicationType: DiscountApplicationEnums.totalServiceFee,
    discountDateType: DiscountDateTypeEnum.permanent,
};

export const adminNewPromoCodeSlice = createSlice({
    name: 'adminNewPromoCodeSlice',
    initialState,
    reducers: {
        setPromoCodeTextValue: (state, action: PayloadAction<string>) => {
            state.promoCode = action.payload;
        },
        setDiscountType: (state, action: PayloadAction<DiscountTypeEnums>) => {
            state.discountType = action.payload;
        },
        setFlatDiscountValue: (state, action: PayloadAction<string>) => {
            state.flatDiscountValue = action.payload;
        },
        setPercentOffValue: (state, action: PayloadAction<string>) => {
            state.percentOffValue = action.payload;
        },
        setDiscountApplicationType: (state, action: PayloadAction<DiscountApplicationEnums>) => {
            state.discountApplicationType = action.payload;
        },
        setSelectedServiceLevels: (state, action: PayloadAction<number[]>) => {
            state.selectedDiscountApplicationServiceLevelsIds = action.payload;
        },
        toggleSelectedServiceLevel: (state, action: PayloadAction<number>) => {
            const isAlreadySelected =
                state.selectedDiscountApplicationServiceLevelsIds?.filter((id) => id === action.payload).length > 0;

            if (isAlreadySelected) {
                state.selectedDiscountApplicationServiceLevelsIds =
                    state.selectedDiscountApplicationServiceLevelsIds?.filter((id) => id !== action.payload);
            } else {
                state.selectedDiscountApplicationServiceLevelsIds?.push(action.payload);
            }
        },
        setDiscountStartDate: (state, action: PayloadAction<string>) => {
            state.discountStartDate = action.payload;
        },
        setDiscountEndDate: (state, action: PayloadAction<string>) => {
            state.discountEndDate = action.payload;
        },
        setDiscountDateType: (state, action: PayloadAction<DiscountDateTypeEnum>) => {
            state.discountDateType = action.payload;
        },
        setShowNewPromoCodeDialog: (state, action: PayloadAction<boolean>) => {
            state.showNewPromoCodeDialog = action.payload;
        },
        setModalTitle: (state, action: PayloadAction<string>) => {
            state.modalTitle = action.payload;
        },
        setAvailableServiceLevels: (
            state,
            action: PayloadAction<
                {
                    value: string;
                    id: number;
                }[]
            >,
        ) => {
            state.availableApplicationServiceLevels = action.payload;
        },
        clearNewPromoCodeState: (state) => initialState,
    },
    extraReducers: {},
});

export const {
    setPromoCodeTextValue,
    setPercentOffValue,
    setDiscountType,
    setFlatDiscountValue,
    setDiscountApplicationType,
    toggleSelectedServiceLevel,
    setDiscountDateType,
    setDiscountStartDate,
    setDiscountEndDate,
    setShowNewPromoCodeDialog,
    clearNewPromoCodeState,
    setModalTitle,
    setAvailableServiceLevels,
    setSelectedServiceLevels,
} = adminNewPromoCodeSlice.actions;

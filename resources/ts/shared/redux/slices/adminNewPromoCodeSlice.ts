import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DiscountDateTypeEnum } from '@shared/constants/DiscountDateTypeEnum';
import { DiscountTypeEnums } from '@shared/constants/DiscountTypeEnums';
import { MinThresholdTypeEnum } from '@shared/constants/MinThresholdTypeEnum';
import { CouponApplicableEntity } from '@shared/entities/CouponApplicableEntity';

export interface NewPromoCodeDialogState {
    showNewPromoCodeDialog: boolean;
    modalTitle: string;
    promoCode: string;
    availableApplicationServiceLevels?: {
        value: string;
        id: number;
    }[];
    type: DiscountTypeEnums;
    discountApplicationType: string;
    selectedDiscountApplicationServiceLevelsIds: number[];
    discountValue?: string;
    availableFrom?: string;
    availableTill?: string;
    discountDateType: DiscountDateTypeEnum;
    isPermanent: boolean;
    applicables?: CouponApplicableEntity[];
    isTableLoading: boolean;
    description: string;
    usageAllowed: null | number;
    minThresholdType: MinThresholdTypeEnum;
    minThresholdValue: number;
}

const initialState: NewPromoCodeDialogState = {
    showNewPromoCodeDialog: false,
    isTableLoading: false,
    description: '',
    modalTitle: 'Create New Promo Code',
    promoCode: '',
    availableFrom: '',
    availableTill: '',
    discountValue: '',
    applicables: [
        {
            id: -1,
            code: '',
            label: '',
            apiSuffix: '',
            description: '',
            isActive: false,
            couponables: [],
            createdAt: '' as any,
            updatedAt: '' as any,
        },
    ],
    selectedDiscountApplicationServiceLevelsIds: [-2],
    type: DiscountTypeEnums.percentage,
    discountApplicationType: '',
    discountDateType: DiscountDateTypeEnum.permanent,
    isPermanent: true,
    usageAllowed: null,
    minThresholdType: MinThresholdTypeEnum.None,
    minThresholdValue: 2,
};

export const adminNewPromoCodeSlice = createSlice({
    name: 'adminNewPromoCodeSlice',
    initialState,
    reducers: {
        setPromoCodeTextValue: (state, action: PayloadAction<string>) => {
            state.promoCode = action.payload;
        },
        setDiscountType: (state, action: PayloadAction<DiscountTypeEnums>) => {
            state.type = action.payload;
        },
        setDiscountApplicationType: (state, action: PayloadAction<any>) => {
            state.discountApplicationType = action.payload;
        },
        setSelectedServiceLevels: (state, action: PayloadAction<number[]>) => {
            state.selectedDiscountApplicationServiceLevelsIds = action.payload;
        },
        setDiscountValue: (state, action: PayloadAction<string>) => {
            state.discountValue = action.payload;
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
            state.availableFrom = action.payload;
        },
        setDiscountEndDate: (state, action: PayloadAction<string>) => {
            state.availableTill = action.payload;
        },
        setDiscountDateType: (state, action: PayloadAction<boolean>) => {
            state.isPermanent = action.payload;
        },
        setUsageAllowedType: (state, action: PayloadAction<null | number>) => {
            state.usageAllowed = action.payload;
        },
        setShowNewPromoCodeDialog: (state, action: PayloadAction<boolean>) => {
            state.showNewPromoCodeDialog = action.payload;
        },
        setModalTitle: (state, action: PayloadAction<string>) => {
            state.modalTitle = action.payload;
        },
        setApplicables: (state, action: PayloadAction<CouponApplicableEntity[]>) => {
            state.applicables = action.payload;
        },
        setIsTableLoading: (state, action: PayloadAction<boolean>) => {
            state.isTableLoading = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setCouponablesForApplicables: (
            state,
            action: PayloadAction<{ applicableCode: string; couponables: any[] }>,
        ) => {
            const applicableIndex = state?.applicables?.findIndex(
                (item) => item.code === action.payload.applicableCode,
            );
            if (applicableIndex !== -1) {
                // @ts-ignore
                state.applicables[applicableIndex].couponables = action.payload.couponables;
            }
        },
        clearNewPromoCodeState: () => initialState,
        setMinThresholdType: (state, action: PayloadAction<MinThresholdTypeEnum>) => {
            state.minThresholdType = action.payload;
        },
        setMinThresholdValue: (state, action: PayloadAction<number>) => {
            state.minThresholdValue = action.payload;
        },
    },
    extraReducers: {},
});

export const {
    setPromoCodeTextValue,
    setDiscountType,
    setDiscountApplicationType,
    toggleSelectedServiceLevel,
    setDiscountDateType,
    setDiscountStartDate,
    setDiscountEndDate,
    setShowNewPromoCodeDialog,
    clearNewPromoCodeState,
    setModalTitle,
    setSelectedServiceLevels,
    setDiscountValue,
    setUsageAllowedType,
    setApplicables,
    setCouponablesForApplicables,
    setIsTableLoading,
    setDescription,
    setMinThresholdValue,
    setMinThresholdType,
} = adminNewPromoCodeSlice.actions;

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

export interface SubmissionService {
    id: number;
    type: 'card';
    maxProtectionAmount: number;
    turnaround: string;
    price: number;
    priceBeforeDiscount?: string;
    discountPercentage?: string;
}

export interface Step01Data {
    availableServiceLevels: SubmissionService[];
    selectedServiceLevel: SubmissionService;
    status: any;
}

export type SearchResultItemCardProps = {
    image: string;
    name: string;
    longName: string;
    shortName: string;
    addedMode?: boolean;
    id: number;
    qty?: number;
    value?: number;
};

export interface AddCardsToSubmission {
    searchValue: any;
    searchResults: SearchResultItemCardProps[];
    selectedCards: SearchResultItemCardProps[];
    shippingFee: number;
    isMobileSearchModalOpen: boolean;
}

export interface Address {
    firstName: string;
    lastName: string;
    address: string;
    flat?: string;
    city: string;
    country: { name: string; code: string; id: number };
    state: { name: string; code: string; id: number };
    zipCode: string;
    phoneNumber: string;
    id: number;
    userId?: number;
    isDefaultShipping?: boolean;
    isDefaultBilling?: boolean;
}

export interface CreditCard {
    expMonth: number;
    expYear: number;
    last4: string;
    brand: string;
    id: string;
}

export interface ShippingSubmissionState {
    existingAddresses: Address[] | [];
    selectedAddress: Address;
    availableStatesList: { name: string; code: string; id: number }[];
    saveForLater: boolean;
    fetchingStatus: string | null;
    disableAllShippingInputs: boolean;
    useCustomShippingAddress: boolean;
    selectedExistingAddress: Address;
}

export interface PaymentSubmissionState {
    paymentMethodId: number;
    existingCreditCards?: CreditCard[];
    selectedCreditCard: CreditCard;
    saveForLater: boolean;
    useShippingAddressAsBillingAddress: boolean;
    selectedBillingAddress: Address;
    existingBillingAddresses: Address[];
    availableStatesList: { name: string; code: string; id: number }[];
    fetchingStatus: string | null;
}

export interface NewSubmissionSliceState {
    isNextDisabled: boolean;
    isNextLoading: boolean;
    totalInAgs: number;
    paymentMethodDiscountedAmount: number;
    orderTransactionHash: string;
    confirmedCollectorCoinPayment: boolean;
    currentStep: number;
    previewTotal: number;
    availableCredit: number;
    appliedCredit: number;
    step01Status: any;
    orderID: number;
    grandTotal: number;
    orderNumber: string;
    couponState: {
        isCouponValid: boolean;
        couponCode: string;
        validCouponId: number;
        isCouponApplied: boolean;
        couponInvalidMessage: string;
        appliedCouponData: {
            id: number;
            discountStatement: string;
            discountValue: string;
            discountedAmount: number;
        };
    };
    step01Data: Step01Data;
    step02Data: AddCardsToSubmission;
    step03Data: ShippingSubmissionState;
    step04Data: PaymentSubmissionState;
}

const initialState: NewSubmissionSliceState = {
    orderID: -1,
    totalInAgs: 0,
    confirmedCollectorCoinPayment: false,
    orderTransactionHash: '',
    grandTotal: 0,
    availableCredit: 0,
    previewTotal: 0,
    appliedCredit: 0,
    orderNumber: '',
    paymentMethodDiscountedAmount: 0,
    isNextDisabled: false,
    isNextLoading: false,
    currentStep: 0,
    couponState: {
        isCouponValid: false,
        couponCode: '',
        validCouponId: -1,
        isCouponApplied: false,
        couponInvalidMessage: '',
        appliedCouponData: {
            id: -1,
            discountStatement: '',
            discountValue: '',
            discountedAmount: 0,
        },
    },
    step01Status: null,
    step01Data: {
        availableServiceLevels: [
            {
                id: 1,
                type: 'card',
                maxProtectionAmount: 500,
                turnaround: '28-30 Day',
                price: 20,
            },
        ],
        selectedServiceLevel: {
            id: 1,
            type: 'card',
            maxProtectionAmount: 500,
            turnaround: '28-30 Day',
            price: 20,
        },
        status: 'success',
    },
    step02Data: {
        searchValue: '',
        searchResults: [],
        selectedCards: [],
        shippingFee: 0,
        isMobileSearchModalOpen: false,
    },
    step03Data: {
        existingAddresses: [],
        selectedAddress: {
            firstName: '',
            lastName: '',
            address: '',
            flat: '',
            city: '',
            state: {
                id: 0,
                code: '',
                name: '',
            },
            zipCode: '',
            phoneNumber: '',
            country: {
                id: 0,
                code: '',
                name: '',
            },
            id: -1,
            userId: 0,
            isDefaultShipping: false,
            isDefaultBilling: false,
        },
        selectedExistingAddress: {
            firstName: '',
            lastName: '',
            address: '',
            flat: '',
            city: '',
            state: {
                id: 0,
                code: '',
                name: '',
            },
            zipCode: '',
            phoneNumber: '',
            country: {
                id: 0,
                code: '',
                name: '',
            },
            id: -1,
            userId: 0,
            isDefaultShipping: false,
            isDefaultBilling: false,
        },
        availableStatesList: [
            {
                name: '',
                code: '',
                id: 0,
            },
        ],
        fetchingStatus: null,
        saveForLater: true,
        disableAllShippingInputs: false,
        useCustomShippingAddress: false,
    },
    step04Data: {
        paymentMethodId: 1,
        existingCreditCards: [],
        availableStatesList: [],
        selectedCreditCard: {
            expMonth: 0,
            expYear: 0,
            last4: '',
            brand: '',
            id: '',
        },
        saveForLater: true,
        useShippingAddressAsBillingAddress: true,
        selectedBillingAddress: {
            firstName: '',
            lastName: '',
            address: '',
            flat: '',
            city: '',
            state: {
                id: 0,
                code: '',
                name: '',
            },
            zipCode: '',
            phoneNumber: '',
            country: {
                id: 0,
                code: '',
                name: '',
            },
            id: 0,
            userId: 0,
            isDefaultShipping: false,
            isDefaultBilling: false,
        },
        existingBillingAddresses: [],
        fetchingStatus: null,
    },
};

export const getServiceLevels = createAsyncThunk('newSubmission/getServiceLevels', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/orders/payment-plans/');
    const serviceLevels = await endpoint.get('');
    return serviceLevels.data.map((serviceLevel: any) => ({
        id: serviceLevel.id,
        type: 'card',
        maxProtectionAmount: serviceLevel.maxProtectionAmount,
        turnaround: serviceLevel.turnaround,
        price: serviceLevel.price,
        priceBeforeDiscount: serviceLevel.priceBeforeDiscount,
        discountPercentage: serviceLevel.discountPercentage,
    }));
});

export const getAvailableCredit = createAsyncThunk('newSubmission/getAvailableCredit', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/wallet');
    const response = await endpoint.get('');
    return response.data.balance;
});

export const getTotalInAGS = createAsyncThunk(
    'newSubmission/getTotalInAGS',
    async (input: { orderID: number; chainID: number; paymentByWallet: number; discountedAmount: number }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(
            `customer/orders/${input.orderID}/collector-coin?payment_blockchain_network=${input?.chainID}`,
        );
        const response = await endpoint.get('');
        return response.data.value;
    },
);

export const getStatesList = createAsyncThunk('newSubmission/getStatesList', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/addresses/states');
    const americanStates = await endpoint.get('');
    return americanStates.data;
});

export const getShippingFee = createAsyncThunk(
    'newSubmission/getShippingFee',
    async (selectedCards: SearchResultItemCardProps[]) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint('customer/orders/shipping-fee');
        const DTO = {
            items: selectedCards.map((item) => ({
                quantity: item.qty,
                declaredValuePerUnit: item.value,
            })),
        };
        const shippingFeeResponse = await endpoint.post('', DTO);
        return shippingFeeResponse.data.shippingFee;
    },
);

export const getSavedAddresses = createAsyncThunk('newSubmission/getSavedAddresses', async (_, { getState }: any) => {
    const availableStatesList: any = getState().newSubmission.step03Data.availableStatesList;
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/addresses');
    const customerAddresses = await endpoint.get('');
    const formattedAddresses: Address[] = customerAddresses.data.map((address: any) => {
        return {
            id: address.id,
            userId: address.userId,
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            zipCode: address.zip,
            phoneNumber: address.phone,
            flat: address.flat ?? '',
            city: address.city,
            isDefaultShipping: address.isDefaultShipping,
            isDefaultBilling: address.isDefaultSilling,
            // Doing this because the back-end can't give me this full object for the state
            // so I'll just search for the complete object inside the existing states
            state: availableStatesList.find((item: any) => item.code === address.state),
            country: {
                id: address.country.id,
                code: address.country.code,
                name: address.country.name,
            },
        };
    });
    return formattedAddresses;
});

export const getCollectorCoinPaymentStatus = createAsyncThunk(
    'newSubmission/getCollectorCoinPaymentStatus',
    async (input: { orderID: number; txHash: string }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`customer/orders/${input.orderID}/payments/${input.txHash}`);
        const response = await endpoint.post('');

        return {
            message: response.data.message,
            transactionHash: input.txHash,
        };
    },
);

export const verifyOrderStatus = createAsyncThunk(
    'newSubmission/verifyOrderStatus',
    async (input: { orderID: number; txHash: string }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`customer/orders/${input.orderID}/payments`);
        const response = await endpoint.post('', { transactionHash: input.txHash });
        return response.data;
    },
);

export const createOrder = createAsyncThunk('newSubmission/createOrder', async (_, { getState }: any) => {
    const currentSubmission: any = getState().newSubmission;
    const finalShippingAddress =
        currentSubmission.step03Data.existingAddresses.length !== 0 &&
        !currentSubmission.step03Data.useCustomShippingAddress &&
        currentSubmission.step03Data.selectedExistingAddress.id !== 0
            ? currentSubmission.step03Data.selectedExistingAddress
            : currentSubmission.step03Data.selectedAddress;

    const orderDTO = {
        paymentPlan: {
            id: currentSubmission.step01Data.selectedServiceLevel.id,
        },
        items: currentSubmission.step02Data.selectedCards.map((selectedCard: any) => ({
            cardProduct: {
                id: selectedCard.id,
            },
            quantity: selectedCard.qty,
            declaredValuePerUnit: selectedCard.value,
        })),
        shippingAddress: {
            firstName: finalShippingAddress.firstName,
            lastName: finalShippingAddress.lastName,
            address: finalShippingAddress.address,
            city: finalShippingAddress.city,
            state: finalShippingAddress.state.code,
            zip: finalShippingAddress.zipCode,
            phone: finalShippingAddress.phoneNumber,
            flat: finalShippingAddress.flat,
            saveForLater:
                currentSubmission.step03Data.selectedExistingAddress.id !== -1
                    ? false
                    : currentSubmission.step03Data.saveForLater,
        },
        customerAddress: {
            id:
                currentSubmission.step03Data.selectedExistingAddress.id !== -1
                    ? currentSubmission.step03Data.selectedExistingAddress.id
                    : null,
        },
        shippingMethod: {
            id: 1,
        },
        coupon: currentSubmission.couponState.isCouponApplied
            ? {
                  code: currentSubmission?.couponState?.couponCode,
                  id: currentSubmission?.couponState?.appliedCouponData.id,
              }
            : null,
        paymentByWallet: currentSubmission.appliedCredit ?? 0,
    };
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/orders');
    const newOrder = await endpoint.post('', orderDTO);
    return newOrder.data;
});

export const newSubmissionSlice = createSlice({
    name: 'newSubmission',
    initialState,
    reducers: {
        nextStep: (state) => {
            if (state.currentStep !== 4) {
                state.currentStep += 1;
            }
        },
        backStep: (state) => {
            if (state.currentStep !== 0) {
                state.currentStep -= 1;
            }
        },
        setCustomStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        setAllServiceLevels: (state, action: PayloadAction<SubmissionService[]>) => {
            state.step01Data.availableServiceLevels = action.payload;
        },
        setServiceLevel: (state, action: PayloadAction<SubmissionService>) => {
            state.step01Data.selectedServiceLevel = action.payload;
        },
        setCardsSearchValue: (state, action: PayloadAction<string>) => {
            state.step02Data.searchValue = action.payload;
            // TODO: This will be replaced with search integration
            state.step02Data.searchResults = [];
        },
        markCardAsSelected: (state, action: PayloadAction<SearchResultItemCardProps>) => {
            state.step02Data.selectedCards = [
                ...state.step02Data.selectedCards,
                { ...action.payload, qty: 1, value: 1 },
            ];
        },
        markCardAsUnselected: (state, action: PayloadAction<Pick<SearchResultItemCardProps, 'id'>>) => {
            state.step02Data.selectedCards = state.step02Data.selectedCards.filter(
                (cardItem) => cardItem.id !== action.payload.id,
            );
        },
        changeSelectedCardQty: (state, action: PayloadAction<{ card: SearchResultItemCardProps; qty: number }>) => {
            const lookup = state.step02Data.selectedCards.find((card) => card.id === action.payload.card.id);
            if (lookup) {
                lookup.qty = action.payload.qty;
            }
        },
        changeSelectedCardValue: (
            state,
            action: PayloadAction<{ card: SearchResultItemCardProps; newValue: number }>,
        ) => {
            const lookup = state.step02Data.selectedCards.find((card) => card.id === action.payload.card.id);
            if (lookup) {
                lookup.value = action.payload.newValue;
            }
        },
        setIsNextDisabled: (state, action: PayloadAction<boolean>) => {
            state.isNextDisabled = action.payload;
        },
        setIsNextLoading: (state, action: PayloadAction<boolean>) => {
            state.isNextDisabled = action.payload;
            state.isNextLoading = action.payload;
        },
        setSaveShippingAddress: (state, action: PayloadAction<boolean>) => {
            state.step03Data.saveForLater = action.payload;
        },
        updateShippingAddressField: (state, action: PayloadAction<{ fieldName: string; newValue: any }>) => {
            // @ts-ignore
            state.step03Data.selectedAddress[action.payload.fieldName] = action.payload.newValue;
        },
        updatePaymentMethodId: (state, action: PayloadAction<number>) => {
            state.step04Data.paymentMethodId = action.payload;
        },
        setSaveCardForLater: (state, action: PayloadAction<boolean>) => {
            state.step04Data.saveForLater = action.payload;
        },
        updatePaymentMethodField: (state, action: PayloadAction<{ fieldName: string; newValue: any }>) => {
            // @ts-ignore
            state.step04Data.selectedCreditCard[action.payload.fieldName] = action.payload.newValue;
        },
        setUseShippingAddressAsBilling: (state, action: PayloadAction<boolean>) => {
            state.step04Data.useShippingAddressAsBillingAddress = action.payload;
        },
        updateBillingAddressField: (state, action: PayloadAction<{ fieldName: string; newValue: any }>) => {
            // @ts-ignore
            state.step04Data.selectedBillingAddress[action.payload.fieldName] = action.payload.newValue;
        },
        setBillingAddressEqualToShippingAddress: (state) => {
            state.step04Data.selectedBillingAddress = state.step03Data.selectedAddress;
        },
        setBillingAddress: (state, action: PayloadAction<Address>) => {
            state.step04Data.selectedBillingAddress = action.payload;
        },
        saveStripeCustomerCards: (state, action: PayloadAction<CreditCard[]>) => {
            state.step04Data.existingCreditCards = action.payload;
            if (action.payload.length > 0) {
                state.step04Data.selectedCreditCard = action.payload[0];
            }
        },
        setSelectedStripeCard: (state, action: PayloadAction<string>) => {
            const lookup = state.step04Data?.existingCreditCards?.find((card) => card.id === action.payload);
            if (lookup) {
                state.step04Data.selectedCreditCard = lookup;
            }
        },
        setDisableAllShippingInputs: (state, action: PayloadAction<boolean>) => {
            state.step03Data.disableAllShippingInputs = action.payload;
        },
        setSelectedExistingAddress: (state, action: PayloadAction<number>) => {
            const lookup = state.step03Data?.existingAddresses?.find((address) => address.id === action.payload);
            if (lookup) {
                state.step03Data.selectedExistingAddress = lookup;
            }
        },
        resetSelectedExistingAddress: (state) => {
            state.step03Data.selectedExistingAddress = initialState.step03Data.selectedExistingAddress;
        },
        setUseCustomShippingAddress: (state, action: PayloadAction<boolean>) => {
            state.step03Data.useCustomShippingAddress = action.payload;
            state.step03Data.selectedAddress = initialState.step03Data.selectedAddress;
        },
        setIsMobileSearchModalOpen: (state, action: PayloadAction<boolean>) => {
            state.step02Data.isMobileSearchModalOpen = action.payload;
        },
        setIsCouponValid: (state, action: PayloadAction<boolean>) => {
            state.couponState.isCouponValid = action.payload;
        },
        setValidCouponId: (state, action: PayloadAction<number>) => {
            state.couponState.validCouponId = action.payload;
        },
        setCouponCode: (state, action: PayloadAction<string>) => {
            state.couponState.couponCode = action.payload;
        },
        SetCouponInvalidMessage: (state, action: PayloadAction<string>) => {
            state.couponState.couponInvalidMessage = action.payload;
        },
        setIsCouponApplied: (state, action: PayloadAction<boolean>) => {
            state.couponState.isCouponApplied = action.payload;
        },
        setAppliedCouponData: (
            state,
            action: PayloadAction<{
                id: number;
                discountStatement: string;
                discountValue: string;
                discountedAmount: number;
            }>,
        ) => {
            state.couponState.appliedCouponData = action.payload;
        },
        setAppliedCredit: (state, action: PayloadAction<number>) => {
            state.appliedCredit = action.payload;
        },
        setPreviewTotal: (state, action: PayloadAction<number>) => {
            state.previewTotal = action.payload;
        },
        clearSubmissionState: () => initialState,
        resetCouponState: (state) => {
            state.couponState = {
                isCouponValid: false,
                couponCode: '',
                validCouponId: -1,
                isCouponApplied: false,
                couponInvalidMessage: '',
                appliedCouponData: {
                    id: -1,
                    discountStatement: '',
                    discountValue: '',
                    discountedAmount: 0,
                },
            };
        },
    },
    extraReducers: {
        [getServiceLevels.pending as any]: (state) => {
            state.step01Data.status = 'loading';
        },
        [getServiceLevels.fulfilled as any]: (state, action: any) => {
            state.step01Data.availableServiceLevels = action.payload;
            state.step01Data.selectedServiceLevel = action.payload[0];
            state.step01Data.status = 'success';
        },
        [getServiceLevels.rejected as any]: (state) => {
            state.step01Data.status = 'failed';
        },
        [getCollectorCoinPaymentStatus.fulfilled as any]: (state, action) => {
            state.confirmedCollectorCoinPayment = action.payload.message === 'Payment verified successfully';
            state.orderTransactionHash = action.payload.transactionHash;
        },
        [getStatesList.pending as any]: (state) => {
            state.step03Data.fetchingStatus = 'loading';
        },
        [getStatesList.fulfilled as any]: (state, action) => {
            state.step03Data.availableStatesList = action.payload;
            state.step03Data.fetchingStatus = 'success';
        },
        [getStatesList.rejected as any]: (state) => {
            state.step03Data.fetchingStatus = 'failed';
        },
        [getShippingFee.fulfilled as any]: (state, action) => {
            state.step02Data.shippingFee = action.payload;
        },
        [getSavedAddresses.fulfilled as any]: (state, action) => {
            state.step03Data.existingAddresses = action.payload;
        },
        [getAvailableCredit.fulfilled as any]: (state, action) => {
            state.availableCredit = action.payload;
        },
        [getTotalInAGS.fulfilled as any]: (state, action) => {
            state.totalInAgs = action.payload;
        },
        [createOrder.fulfilled as any]: (state, action) => {
            state.grandTotal = action.payload.grandTotal;
            state.orderNumber = action.payload.orderNumber;
            state.orderID = action.payload.id;
            state.step02Data.selectedCards = action.payload.orderItems.map((orderItem: any) => ({
                image: orderItem.cardProduct.imagePath,
                name: orderItem.cardProduct.name,
                longName: orderItem.cardProduct.longName,
                shortName: orderItem.cardProduct.shortName,
                id: orderItem.cardProduct.id,
                qty: orderItem.quantity,
                value: orderItem.declaredValuePerUnit,
            }));
            state.step01Data.selectedServiceLevel = state.step01Data.availableServiceLevels.find(
                (plan) => plan.id === action.payload.paymentPlan.id,
            ) as any;
            state.couponState.isCouponValid = Boolean(action.payload.discountedAmount);
            state.couponState.validCouponId = action.payload.discountedAmount ? action.payload.coupon.id : -1;
            state.couponState.isCouponApplied = Boolean(action.payload.discountedAmount);
            state.couponState.couponCode = action.payload.discountedAmount ? action.payload.coupon.code : '';
            state.couponState.appliedCouponData.id = action.payload.discountedAmount ? action.payload.coupon.id : -1;
            state.couponState.appliedCouponData.discountStatement = action.payload.discountedAmount
                ? action.payload.coupon.discountStatement
                : '';
            state.couponState.appliedCouponData.discountValue = action.payload.discountedAmount
                ? action.payload.coupon.discountValue
                : '';
            state.couponState.appliedCouponData.discountedAmount = action.payload.discountedAmount
                ? action.payload.discountedAmount
                : '';
            state.appliedCredit = action.payload.amountPaidFromWallet;
        },
    },
});

export const {
    nextStep,
    backStep,
    setCustomStep,
    setServiceLevel,
    setIsNextDisabled,
    setCardsSearchValue,
    setSaveShippingAddress,
    updateShippingAddressField,
    markCardAsSelected,
    markCardAsUnselected,
    changeSelectedCardQty,
    changeSelectedCardValue,
    updatePaymentMethodId,
    setSaveCardForLater,
    setUseShippingAddressAsBilling,
    updatePaymentMethodField,
    updateBillingAddressField,
    saveStripeCustomerCards,
    setBillingAddressEqualToShippingAddress,
    setSelectedStripeCard,
    setDisableAllShippingInputs,
    setSelectedExistingAddress,
    setUseCustomShippingAddress,
    resetSelectedExistingAddress,
    setBillingAddress,
    setIsNextLoading,
    clearSubmissionState,
    setIsMobileSearchModalOpen,
    setIsCouponValid,
    setCouponCode,
    setValidCouponId,
    setIsCouponApplied,
    setAppliedCouponData,
    setAppliedCredit,
    setPreviewTotal,
    SetCouponInvalidMessage,
} = newSubmissionSlice.actions;

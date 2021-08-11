import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { resolveInjectable } from '@shared/lib/dependencyInjection/resolveInjectable';
import { APIService } from '@shared/services/APIService';

export interface SubmissionService {
    id: number;
    type: 'card';
    maxProtectionAmount: number;
    turnaround: string;
    price: number;
}

export interface Step01Data {
    availableServiceLevels: SubmissionService[];
    selectedServiceLevel: SubmissionService;
    status: any;
}

export type SearchResultItemCardProps = {
    image: string;
    title: string;
    subtitle: string;
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
    userId: number;
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
    currentStep: number;
    step01Status: any;
    step01Data: Step01Data;
    step02Data: AddCardsToSubmission;
    step03Data: ShippingSubmissionState;
    step04Data: PaymentSubmissionState;
}

const initialState: NewSubmissionSliceState = {
    isNextDisabled: false,
    currentStep: 0,
    step01Status: null,
    step01Data: {
        availableServiceLevels: [],
        selectedServiceLevel: {
            id: 1,
            type: 'card',
            maxProtectionAmount: 500,
            turnaround: '28-39 Day',
            price: 1000,
        },
        status: null,
    },
    step02Data: {
        searchValue: '',
        searchResults: [],
        selectedCards: [],
        shippingFee: 0,
    },
    step03Data: {
        existingAddresses: [],
        selectedAddress: {
            firstName: '',
            lastName: '',
            address: '',
            flat: '',
            city: '',
            state: { id: 0, code: '', name: '' },
            zipCode: '',
            phoneNumber: '',
            country: { id: 0, code: '', name: '' },
            // Setting it to -1 so we know for sure this isn't a real address id by default
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
            state: { id: 0, code: '', name: '' },
            zipCode: '',
            phoneNumber: '',
            country: { id: 0, code: '', name: '' },
            id: -1,
            userId: 0,
            isDefaultShipping: false,
            isDefaultBilling: false,
        },
        availableStatesList: [{ name: '', code: '', id: 0 }],
        fetchingStatus: null,
        saveForLater: true,
        disableAllShippingInputs: false,
        useCustomShippingAddress: false,
    },
    step04Data: {
        paymentMethodId: 0,
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
            state: { id: 0, code: '', name: '' },
            zipCode: '',
            phoneNumber: '',
            country: { id: 0, code: '', name: '' },
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
    const apiService = resolveInjectable(APIService);
    const endpoint = apiService.createEndpoint('customer/orders/payment-plans/');
    const serviceLevels = await endpoint.get('');
    return serviceLevels.data.map((serviceLevel: any) => ({
        id: serviceLevel.id,
        type: 'card',
        maxProtectionAmount: serviceLevel.max_protection_amount,
        turnaround: serviceLevel.turnaround,
        price: serviceLevel.price,
    }));
});

export const getStatesList = createAsyncThunk('newSubmission/getStatesList', async () => {
    const apiService = resolveInjectable(APIService);
    const endpoint = apiService.createEndpoint('customer/addresses/states');
    const americanStates = await endpoint.get('');
    return americanStates.data;
});

export const getShippingFee = createAsyncThunk(
    'newSubmission/getShippingFee',
    async (selectedCards: SearchResultItemCardProps[]) => {
        const apiService = resolveInjectable(APIService);
        const endpoint = apiService.createEndpoint('customer/orders/shipping-fee');
        const DTO = {
            items: selectedCards.map((item) => ({
                quantity: item.qty,
                declared_value_per_unit: item.value,
            })),
        };
        const shippingFeeResponse = await endpoint.post('', DTO);
        return shippingFeeResponse.data.shipping_fee;
    },
);

export const getSavedAddresses = createAsyncThunk('newSubmission/getSavedAddresses', async () => {
    const apiService = resolveInjectable(APIService);
    const endpoint = apiService.createEndpoint('customer/addresses');
    const customerAddresses = await endpoint.get('');
    const formattedAddresses: Address[] = customerAddresses.data.map((address: any) => {
        return {
            id: address.id,
            userId: address.user_id,
            firstName: address.first_name,
            lastName: address.last_name,
            address: address.address,
            zipCode: address.zip,
            phone: address.phone,
            flat: address.flat,
            city: address.city,
            isDefaultShipping: address.is_default_shipping,
            isDefaultBilling: address.is_default_billing,
            state: {
                id: address.state.id,
                code: address.state.code,
                name: address.state.name,
            },
            country: {
                id: address.country.id,
                code: address.country.code,
                name: address.country.name,
            },
        };
    });
    return formattedAddresses;
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
        markCardAsUnselected: (state, action: PayloadAction<SearchResultItemCardProps>) => {
            state.step02Data.selectedCards = state.step02Data.selectedCards.filter(
                (cardItem) => cardItem.id !== action.payload.id,
            );
        },
        changeSelectedCardQty: (state, action: PayloadAction<{ card: SearchResultItemCardProps; qty: number }>) => {
            const lookup = state.step02Data.selectedCards.find((card) => card.id == action.payload.card.id);
            if (lookup) {
                lookup.qty = action.payload.qty;
            }
        },
        changeSelectedCardValue: (
            state,
            action: PayloadAction<{ card: SearchResultItemCardProps; newValue: number }>,
        ) => {
            const lookup = state.step02Data.selectedCards.find((card) => card.id == action.payload.card.id);
            if (lookup) {
                lookup.value = action.payload.newValue;
            }
        },
        setIsNextDisabled: (state, action: PayloadAction<boolean>) => {
            state.isNextDisabled = action.payload;
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
        saveStripeCustomerCards: (state, action: PayloadAction<CreditCard[]>) => {
            state.step04Data.existingCreditCards = action.payload;
            if (action.payload.length > 0) {
                state.step04Data.selectedCreditCard = action.payload[0];
            }
        },
        setSelectedStripeCard: (state, action: PayloadAction<string>) => {
            const lookup = state.step04Data?.existingCreditCards?.find((card) => card.id == action.payload);
            if (lookup) {
                state.step04Data.selectedCreditCard = lookup;
            }
        },
        setDisableAllShippingInputs: (state, action: PayloadAction<boolean>) => {
            state.step03Data.disableAllShippingInputs = action.payload;
        },
        setSelectedExistingAddress: (state, action: PayloadAction<number>) => {
            const lookup = state.step03Data?.existingAddresses?.find((address) => address.id == action.payload);
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
        [getStatesList.pending as any]: (state) => {
            state.step03Data.fetchingStatus = 'loading';
        },
        [getStatesList.fulfilled as any]: (state, action) => {
            state.step03Data.availableStatesList = action.payload;
            state.step03Data.fetchingStatus = 'success';
        },
        [getStatesList.rejected as any]: (state, action) => {
            state.step03Data.fetchingStatus = 'failed';
        },
        [getShippingFee.fulfilled as any]: (state, action) => {
            state.step02Data.shippingFee = action.payload;
        },
        [getSavedAddresses.fulfilled as any]: (state, action) => {
            state.step03Data.existingAddresses = action.payload;
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
} = newSubmissionSlice.actions;

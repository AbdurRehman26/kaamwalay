import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
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
    currentStep: number;
    step01Status: any;
    orderID: number;
    grandTotal: number;
    orderNumber: string;
    step01Data: Step01Data;
    step02Data: AddCardsToSubmission;
    step03Data: ShippingSubmissionState;
    step04Data: PaymentSubmissionState;
}

const initialState: NewSubmissionSliceState = {
    orderID: -1,
    grandTotal: 0,
    orderNumber: '',
    isNextDisabled: false,
    isNextLoading: false,
    currentStep: 0,
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
            {
                id: 2,
                type: 'card',
                maxProtectionAmount: 1000,
                turnaround: '12-14 Day',
                price: 50,
            },
            {
                id: 3,
                type: 'card',
                maxProtectionAmount: 2500,
                turnaround: '5-7 Day',
                price: 100,
            },
            {
                id: 4,
                type: 'card',
                maxProtectionAmount: 10000,
                turnaround: '2-3 Day',
                price: 250,
            },
            {
                id: 5,
                type: 'card',
                maxProtectionAmount: 50000,
                turnaround: '1 Day',
                price: 1000,
            },
            {
                id: 6,
                type: 'card',
                maxProtectionAmount: 100000,
                turnaround: '1 Day',
                price: 2000,
            },
            {
                id: 7,
                type: 'card',
                maxProtectionAmount: 1000000,
                turnaround: 'Same Day',
                price: 5000,
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
    }));
});

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

export const createOrder = createAsyncThunk('newSubmission/createOrder', async (_, { getState }: any) => {
    const currentSubmission: any = getState().newSubmission;
    const finalShippingAddress =
        currentSubmission.step03Data.existingAddresses.length !== 0 &&
        !currentSubmission.step03Data.useCustomShippingAddress &&
        currentSubmission.step03Data.selectedExistingAddress.id !== 0
            ? currentSubmission.step03Data.selectedExistingAddress
            : currentSubmission.step03Data.selectedAddress;
    const billingAddress = currentSubmission.step04Data.selectedBillingAddress;

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
        billingAddress: {
            firstName: billingAddress.firstName,
            lastName: billingAddress.lastName,
            address: billingAddress.address,
            city: billingAddress.city,
            state: billingAddress.state.code,
            zip: billingAddress.zipCode,
            phone: finalShippingAddress.phoneNumber,
            flat: billingAddress.flat,
            sameAsShipping: currentSubmission.step04Data.useShippingAddressAsBillingAddress,
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
        paymentMethod: {
            id: currentSubmission.step04Data.paymentMethodId,
        },
        paymentProviderReference: {
            id:
                currentSubmission.step04Data.paymentMethodId === 1
                    ? currentSubmission.step04Data.selectedCreditCard.id
                    : null,
        },
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
        clearSubmissionState: (state) => initialState,
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
        [getStatesList.rejected as any]: (state) => {
            state.step03Data.fetchingStatus = 'failed';
        },
        [getShippingFee.fulfilled as any]: (state, action) => {
            state.step02Data.shippingFee = action.payload;
        },
        [getSavedAddresses.fulfilled as any]: (state, action) => {
            state.step03Data.existingAddresses = action.payload;
        },
        [createOrder.fulfilled as any]: (state, action) => {
            state.grandTotal = action.payload.grandTotal;
            state.orderNumber = action.payload.orderNumber;
            state.orderID = action.payload.id;
            state.step04Data.selectedBillingAddress.address = action.payload.billingAddress.address;
            state.step04Data.selectedBillingAddress.country = action.payload.billingAddress.country;
            state.step04Data.selectedBillingAddress.firstName = action.payload.billingAddress.firstName;
            state.step04Data.selectedBillingAddress.lastName = action.payload.billingAddress.lastName;
            state.step04Data.selectedBillingAddress.flat = action.payload.billingAddress.flat;
            state.step04Data.selectedBillingAddress.id = action.payload.billingAddress.id;
            state.step04Data.selectedCreditCard.expMonth =
                state.step04Data.paymentMethodId === 1 ? action.payload.orderPayment.card.expMonth : '';
            state.step04Data.selectedBillingAddress.phoneNumber = action.payload.billingAddress.phone;
            state.step04Data.selectedBillingAddress.state = state.step03Data.availableStatesList.find(
                (currentState: any) => currentState.code === action.payload.billingAddress.state,
            ) as any;
            state.step04Data.selectedBillingAddress.zipCode = action.payload.billingAddress.zip;
            state.step04Data.selectedBillingAddress.city = action.payload.billingAddress.city;
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
} = newSubmissionSlice.actions;

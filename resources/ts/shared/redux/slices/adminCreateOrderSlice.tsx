import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

export interface Address {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    address: string;
    address2?: string;
    flat?: string;
    city: string;
    country: { name: string; code: string; id: number; phoneCode: string };
    state: { name: string; code: string; id: number };
    stateName?: string;
    zipCode: string;
    phoneNumber: string;
    id: number;
    userId?: number;
    isDefaultShipping?: boolean;
    isDefaultBilling?: boolean;
}

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

export interface CreditCard {
    expMonth: number;
    expYear: number;
    last4: string;
    brand: string;
    id: string;
}

export type SearchResultItemCardProps = {
    image: string;
    name: string;
    longName: string;
    shortName: string;
    addedMode?: boolean;
    id: number;
    orderItemId?: number;
    qty?: number;
    value?: number;
};

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

export interface AddCardsToSubmission {
    searchValue: any;
    searchResults: SearchResultItemCardProps[];
    selectedCards: SearchResultItemCardProps[];
    shippingFee: number;
    cleaningFee: number;
    requiresCleaning: boolean;
    isMobileSearchModalOpen: boolean;
}

export interface ShippingSubmissionState {
    existingAddresses: Address[] | [];
    selectedAddress: Address;
    availableStatesList: { name: string; code: string; id: number }[];
    availableCountriesList: { name: string; code: string; id: number; phoneCode: string }[];
    saveForLater: boolean;
    fetchingStatus: string | null;
    disableAllShippingInputs: boolean;
    useCustomShippingAddress: boolean;
    selectedExistingAddress: Address;
}

export interface AdminNewOrderSliceState {
    shippingMethod: ShippingMethodEntity | null;
    step01Data: Step01Data;
    step02Data: AddCardsToSubmission;
    step03Data: ShippingSubmissionState;
    step04Data: PaymentSubmissionState;
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
}

const initialState: AdminNewOrderSliceState = {
    shippingMethod: null,
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
        selectedCards: [
            // {
            //     image: 'https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png',
            //     name: 'Test one',
            //     longName: 'AD CVIL ',
            //     id: 3,
            //     shortName: 'QA IL',
            //     qty: 4,
            //     value: 6,
            // },
            // {
            //     image: 'https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png',
            //     name: 'Test one',
            //     longName: 'AD POLK ',
            //     id: 7,
            //     shortName: 'QA IL',
            //     qty: 2,
            //     value: 3,
            // }
        ],
        shippingFee: 0,
        cleaningFee: 0,
        requiresCleaning: false,
        isMobileSearchModalOpen: false,
    },
    step03Data: {
        existingAddresses: [],
        selectedAddress: {
            fullName: '',
            lastName: '',
            address: '',
            address2: '',
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
                phoneCode: '',
            },
            id: -1,
            userId: 0,
            isDefaultShipping: false,
            isDefaultBilling: false,
        },
        selectedExistingAddress: {
            fullName: '',
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
                phoneCode: '',
            },
            id: -1,
            userId: 0,
            isDefaultShipping: false,
            isDefaultBilling: false,
        },
        availableCountriesList: [
            {
                name: '',
                code: '',
                id: 0,
                phoneCode: '',
            },
        ],
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
            fullName: '',
            lastName: '',
            address: '',
            address2: '',
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
                phoneCode: '',
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

export const getCountriesList = createAsyncThunk('newSubmission/getCountriesList', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/addresses/countries');
    const countries = await endpoint.get('');
    return countries.data;
});

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
            address2: address.address2,
            zipCode: address.zip,
            phoneNumber: address.phone,
            flat: address.flat ?? '',
            city: address.city,
            isDefaultShipping: address.isDefaultShipping,
            isDefaultBilling: address.isDefaultSilling,
            // Doing this because the back-end can't give me this full object for the state
            // so I'll just search for the complete object inside the existing states
            state: availableStatesList.find((item: any) => item.code === address.state) ?? {
                code: address.state,
            },
            country: {
                id: address.country.id,
                code: address.country.code,
                name: address.country.name,
                phoneCode: address.country.phoneCode,
            },
        };
    });
    console.log('F A ', formattedAddresses);
    return formattedAddresses;
});

export const getShippingFee = createAsyncThunk(
    'newSubmission/getShippingFee',
    async (selectedCards: SearchResultItemCardProps[], thunk) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint('customer/orders/shipping-fee');
        const shippingMethod = (thunk.getState() as any).newSubmission.shippingMethod;
        const shippingAddress = (thunk.getState() as any).newSubmission.step03Data.selectedAddress;
        const existingAddresses = (thunk.getState() as any).newSubmission.step03Data.selectedExistingAddress;

        let state;
        let country;
        if (shippingAddress.address) {
            state = shippingAddress.state.code ? shippingAddress.state.code : shippingAddress.stateName;
            country = shippingAddress.country.code ? shippingAddress.country.code : shippingAddress.country;
        } else {
            state = existingAddresses.state.code ? existingAddresses.state.code : existingAddresses.stateName;
            country = existingAddresses.country.code ? existingAddresses.country.code : existingAddresses.country;
        }
        const DTO = {
            ...((shippingAddress.country.code !== '' || existingAddresses.country.code !== '') && {
                shippingAddress: {
                    address: shippingAddress.address ? shippingAddress.address : existingAddresses.address,
                    city: shippingAddress.city ? shippingAddress.city : existingAddresses.city,
                    state: state ? state : shippingAddress.state,
                    zip: shippingAddress.zipCode ? shippingAddress.zipCode : existingAddresses.zipCode,
                    phone: shippingAddress.phoneNumber ? shippingAddress.phoneNumber : existingAddresses.phoneNumber,
                    countryCode: country,
                },
            }),
            shippingMethodId: shippingMethod.id,
            items: selectedCards.map((item) => ({
                quantity: item.qty,
                declaredValuePerUnit: item.value,
            })),
        };
        const shippingFeeResponse = await endpoint.post('', DTO);
        return shippingFeeResponse.data.shippingFee;
    },
);

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

export const getStatesList = createAsyncThunk('newSubmission/getStatesList', async (input?: { countryId: number }) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(
        `customer/addresses/states?country_id= ${input?.countryId ? input?.countryId : 1}`,
    );
    const americanStates = await endpoint.get('');
    return americanStates.data;
});

export const adminCreateOrderSlice = createSlice({
    name: 'adminCreateOrderSlice',
    initialState: initialState,
    reducers: {
        setShippingMethod(state, action: PayloadAction<ShippingMethodEntity>) {
            state.shippingMethod = action.payload;
        },
        initializeShippingMethod(state, action: PayloadAction<ShippingMethodEntity>) {
            if (!state.shippingMethod) {
                state.shippingMethod = action.payload;
            }
        },
        // setIsNextDisabled: (state, action: PayloadAction<boolean>) => {
        //     state.isNextDisabled = action.payload;
        // },
        resetSelectedExistingAddress: (state) => {
            state.step03Data.selectedExistingAddress = initialState.step03Data.selectedExistingAddress;
        },
        setSaveShippingAddress: (state, action: PayloadAction<boolean>) => {
            state.step03Data.saveForLater = action.payload;
        },
        [getServiceLevels.pending as any]: (state) => {
            state.step01Data.status = 'loading';
        },
        [getServiceLevels.fulfilled as any]: (state, action: any) => {
            state.step01Data.availableServiceLevels = action.payload;
            state.step01Data.status = 'success';
        },
        [getServiceLevels.rejected as any]: (state) => {
            state.step01Data.status = 'failed';
        },
        markCardAsSelected: (state, action: PayloadAction<SearchResultItemCardProps>) => {
            state.step02Data.selectedCards = [
                ...state.step02Data.selectedCards,
                { ...action.payload, qty: 1, value: 1 },
            ];
        },
        setDisableAllShippingInputs: (state, action: PayloadAction<boolean>) => {
            state.step03Data.disableAllShippingInputs = action.payload;
        },
        updateShippingAddressField: (state, action: PayloadAction<{ fieldName: string; newValue: any }>) => {
            // @ts-ignore
            state.step03Data.selectedAddress[action.payload.fieldName] = action.payload.newValue;
        },
        setSelectedExistingAddress: (state, action: PayloadAction<number>) => {
            const lookup = state.step03Data?.existingAddresses?.find((address) => address.id === action.payload);
            if (lookup) {
                state.step03Data.selectedExistingAddress = lookup;
            } else {
                state.step03Data.selectedExistingAddress.id = -1;
                state.shippingMethod.id = action.payload;
            }
        },
        setCardsSearchValue: (state, action: PayloadAction<string>) => {
            state.step02Data.searchValue = action.payload;
            // TODO: This will be replaced with search integration
            state.step02Data.searchResults = [];
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
        updatePaymentMethodId: (state, action: PayloadAction<number>) => {
            // state.step04Data.paymentMethodId = action.payload;
        },
        setUseCustomShippingAddress: (state, action: PayloadAction<boolean>) => {
            state.step03Data.useCustomShippingAddress = action.payload;
            state.step03Data.selectedAddress = initialState.step03Data.selectedAddress;
        },
        SetCouponInvalidMessage: (state, action: PayloadAction<string>) => {
            state.couponState.couponInvalidMessage = action.payload;
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
        setIsCouponApplied: (state, action: PayloadAction<boolean>) => {
            state.couponState.isCouponApplied = action.payload;
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
    },
    extraReducers: {
        [getSavedAddresses.fulfilled as any]: (state, action) => {
            state.step03Data.existingAddresses = action.payload;
            if (!action.payload.length) {
                state.step03Data.disableAllShippingInputs = false;
                state.step03Data.useCustomShippingAddress = true;
            }
        },
    },
});

export const {
    setUseCustomShippingAddress,
    markCardAsSelected,
    setCardsSearchValue,
    changeSelectedCardQty,
    changeSelectedCardValue,
    markCardAsUnselected,
    setCouponCode,
    updatePaymentMethodId,
    setIsCouponApplied,
    setIsCouponValid,
    setValidCouponId,
    setAppliedCouponData,
    SetCouponInvalidMessage,
    setShippingMethod,
    initializeShippingMethod,
    updateShippingAddressField,
    resetSelectedExistingAddress,
    setDisableAllShippingInputs,
    setSelectedExistingAddress,
    setSaveShippingAddress,
} = adminCreateOrderSlice.actions;

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DefaultShippingMethodEntity, ShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { UserEntity } from '@shared/entities/UserEntity';
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
    priceRanges?: any;
    maxPrice?: number;
    minPrice?: number;
}

export interface Step01Data {
    availableServiceLevels: SubmissionService[];
    selectedServiceLevel: SubmissionService;
    selectedServiceLevelId: number;
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
    paymentMethod: { name: string; code: string; id: number };
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
    shippingMethod: ShippingMethodEntity;
    isNextDisabled: boolean;
    createSubmission: boolean;
    userId: number;
    user: Partial<UserEntity>;
    grandTotal: number;
    refundTotal: number;
    extraChargesTotal: number;
    availableCredit: number;
    appliedCredit: number;
    previewTotal: number;
    payNow: boolean;
    manualPayment: boolean;
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
    shippingAddress: any;
    billingAddress: any;
}

const initialState: AdminNewOrderSliceState = {
    userId: -1,
    user: {
        fullName: '',
        email: '',
        profileImage: '',
        customerNumber: '',
        id: -1,
    },
    grandTotal: 0,
    refundTotal: 0,
    extraChargesTotal: 0,
    availableCredit: 0,
    previewTotal: 0,
    appliedCredit: 0,
    payNow: true,
    isNextDisabled: false,
    createSubmission: false,
    manualPayment: true,
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
        availableServiceLevels: [],
        selectedServiceLevelId: 0,
        selectedServiceLevel: {
            id: 1,
            type: 'card',
            maxProtectionAmount: 200,
            turnaround: '20 Business Days',
            price: 18,
            priceRanges: [
                {
                    id: 1,
                    minCards: 1,
                    maxCards: 20,
                    price: 18,
                },
                {
                    id: 2,
                    minCards: 21,
                    maxCards: 50,
                    price: 17,
                },
                {
                    id: 3,
                    minCards: 51,
                    maxCards: 100,
                    price: 16,
                },
                {
                    id: 4,
                    minCards: 101,
                    maxCards: 200,
                    price: 15,
                },
                {
                    id: 5,
                    minCards: 201,
                    maxCards: null,
                    price: 14,
                },
            ],
            maxPrice: 18,
            minPrice: 14,
        },
        status: 'success',
    },
    step02Data: {
        searchValue: '',
        searchResults: [],
        selectedCards: [],
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
        paymentMethod: { id: 0, name: '', code: '' },
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
    shippingMethod: DefaultShippingMethodEntity,
    shippingAddress: [],
    billingAddress: [],
};

export const getCountriesList = createAsyncThunk('adminCreateOrderSlice/getCountriesList', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/addresses/countries');
    const countries = await endpoint.get('');
    return countries.data;
});

export const createOrder = createAsyncThunk('adminCreateOrderSlice/createOrder', async (_, { getState }: any) => {
    const currentSubmission: AdminNewOrderSliceState = getState().adminCreateOrderSlice;
    const finalShippingAddress =
        currentSubmission.step03Data.existingAddresses.length !== 0 &&
        !currentSubmission.step03Data.useCustomShippingAddress &&
        currentSubmission.step03Data.selectedExistingAddress.id !== 0
            ? currentSubmission.step03Data.selectedExistingAddress
            : currentSubmission.step03Data.selectedAddress;
    const billingAddress = currentSubmission.step04Data.selectedBillingAddress;
    const existingAddressId = currentSubmission.step03Data.selectedExistingAddress.id;

    const parsedName = parseName(existingAddressId, finalShippingAddress?.fullName);

    const orderDTO = {
        paymentPlan: {
            id: currentSubmission.step01Data.selectedServiceLevel.id,
        },
        userId: currentSubmission.user.id,
        payNow: currentSubmission.payNow,
        items: currentSubmission.step02Data.selectedCards.map((selectedCard: any) => ({
            cardProduct: {
                id: selectedCard.id,
            },
            quantity: selectedCard.qty,
            declaredValuePerUnit: selectedCard.value,
        })),
        shippingAddress: {
            firstName: existingAddressId !== -1 ? finalShippingAddress.firstName : parsedName?.firstName,
            lastName: existingAddressId !== -1 ? finalShippingAddress.firstName : parsedName?.lastName,
            address: finalShippingAddress.address,
            address2: finalShippingAddress.address2,
            city: finalShippingAddress.city,
            state: finalShippingAddress.state?.code || finalShippingAddress.stateName,
            countryCode: finalShippingAddress.country?.code,
            zip: finalShippingAddress.zipCode,
            phone: finalShippingAddress.phoneNumber,
            flat: finalShippingAddress.flat,
            saveForLater:
                currentSubmission.step03Data.selectedExistingAddress.id !== -1
                    ? false
                    : currentSubmission.step03Data.saveForLater,
        },
        billingAddress: {
            firstName: existingAddressId !== -1 ? billingAddress.firstName : parsedName?.firstName,
            lastName: existingAddressId !== -1 ? billingAddress.lastName : parsedName?.lastName,
            address: billingAddress.address,
            address2: billingAddress.address2,
            city: billingAddress.city,
            state: billingAddress.state.code || finalShippingAddress.stateName,
            countryCode: finalShippingAddress.country.code,
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
            id: currentSubmission.shippingMethod?.id ?? 1,
        },
        coupon: currentSubmission.couponState.isCouponApplied
            ? {
                  code: currentSubmission?.couponState?.couponCode,
                  id: currentSubmission?.couponState?.appliedCouponData.id,
              }
            : null,
        paymentByWallet: currentSubmission.appliedCredit ?? 0,
        requiresCleaning: currentSubmission.step02Data.requiresCleaning
            ? currentSubmission.step02Data.requiresCleaning
            : false,
        paymentMethodId: currentSubmission.payNow ? currentSubmission.step04Data.paymentMethodId : {},
        paymentMethod: currentSubmission.payNow ? currentSubmission.step04Data.paymentMethod : {},
    };
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('admin/orders', { version: 'v3' });
    const newOrder = await endpoint.post('', orderDTO);
    return newOrder.data;
});

export const getSavedAddresses = createAsyncThunk(
    'adminCreateOrderSlice/getSavedAddresses',
    async (customerId: number, { getState }: any) => {
        const availableStatesList: any = getState().adminCreateOrderSlice.step03Data.availableStatesList;
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`admin/customer/${customerId}/addresses`);
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

        return formattedAddresses;
    },
);

export const getShippingFee = createAsyncThunk(
    'adminCreateOrderSlice/getShippingFee',
    async (selectedCards: SearchResultItemCardProps[], thunk) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint('admin/orders/shipping-fee');
        const shippingMethod = (thunk.getState() as any).adminCreateOrderSlice.shippingMethod;
        const shippingAddress = (thunk.getState() as any).adminCreateOrderSlice.step03Data.selectedAddress;
        const existingAddresses = (thunk.getState() as any).adminCreateOrderSlice.step03Data.selectedExistingAddress;

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

export const getServiceLevels = createAsyncThunk('adminCreateOrderSlice/getServiceLevels', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('admin/orders/payment-plans', { version: 'v3' });
    const serviceLevels = await endpoint.get('');

    return serviceLevels.data;
});

export const getPaymentMethod = createAsyncThunk('adminCreateOrderSlice/getPaymentMethod', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('admin/orders/payment-methods?submission_create=true');
    const paymentMethod = await endpoint.get('');
    return paymentMethod.data[0];
});

export const getStatesList = createAsyncThunk(
    'adminCreateOrderSlice/getStatesList',
    async (input?: { countryId: number }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(
            `admin/addresses/states?country_id= ${input?.countryId ? input?.countryId : 1}`,
        );
        const americanStates = await endpoint.get('');
        return americanStates.data;
    },
);

export const getCustomer = createAsyncThunk('adminCreateOrderSlice/getCustomer', async (customerId: number) => {
    const apiService = app(APIService);

    const endpoint = apiService.createEndpoint(`admin/customers/${customerId}`);
    const customer = await endpoint.get('');

    return customer.data;
});

const parseName = (id: number, fullName: any) => {
    if (id === -1) {
        const value = fullName.trim();
        const firstSpace = value.indexOf(' ');
        if (firstSpace === -1) {
            return { firstName: value, lastName: null };
        }

        const firstName = value.slice(0, firstSpace);
        const lastName = value.slice(firstSpace + 1);

        return { firstName, lastName };
    }
};

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
        setIsNextDisabled: (state, action: PayloadAction<boolean>) => {
            state.isNextDisabled = action.payload;
        },
        resetSelectedExistingAddress: (state) => {
            state.step03Data.selectedExistingAddress = initialState.step03Data.selectedExistingAddress;
        },
        setSaveShippingAddress: (state, action: PayloadAction<boolean>) => {
            state.step03Data.saveForLater = action.payload;
        },
        markCardAsSelected: (state, action: PayloadAction<SearchResultItemCardProps>) => {
            state.step02Data.selectedCards = [
                ...state.step02Data.selectedCards,
                { ...action.payload, qty: 1, value: 1 },
            ];
        },
        setPreviewTotal: (state, action: PayloadAction<number>) => {
            state.previewTotal = action.payload;
        },
        resetSelectedCards: (state, action: PayloadAction<[]>) => {
            state.step02Data.selectedCards = action.payload;
        },
        setBillingAddress: (state, action: PayloadAction<Address>) => {
            state.step04Data.selectedBillingAddress = action.payload;
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
        setServiceLevel: (state, action: PayloadAction<SubmissionService>) => {
            state.step01Data.selectedServiceLevel = action.payload;
        },
        setPayNow: (state, action: PayloadAction<boolean>) => {
            state.payNow = action.payload;
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
            state.step04Data.paymentMethodId = action.payload;
        },
        updatePaymentMethod: (state, action: PayloadAction<{ name: string; code: string; id: number }>) => {
            state.step04Data.paymentMethod = action.payload;
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
        clearSubmissionState: () => initialState,
        setIsCouponValid: (state, action: PayloadAction<boolean>) => {
            state.couponState.isCouponValid = action.payload;
        },
        setValidCouponId: (state, action: PayloadAction<number>) => {
            state.couponState.validCouponId = action.payload;
        },
        setCouponCode: (state, action: PayloadAction<string>) => {
            state.couponState.couponCode = action.payload;
        },
        setUserId: (state, action: PayloadAction<number>) => {
            state.userId = action.payload;
        },
        setUser: (state, action: PayloadAction<UserEntity>) => {
            state.user = action.payload;
        },
        setShippingFee: (state, action: PayloadAction<number>) => {
            state.step02Data.shippingFee = action.payload;
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
        [getCountriesList.fulfilled as any]: (state, action) => {
            state.step03Data.availableCountriesList = action.payload;
        },
        [getPaymentMethod.fulfilled as any]: (state, action: any) => {
            state.step04Data.paymentMethod = action.payload;
        },
        [getShippingFee.fulfilled as any]: (state, action) => {
            state.step02Data.shippingFee = action.payload;
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
        [getCustomer.fulfilled as any]: (state, action) => {
            state.user = action.payload;
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
    updatePaymentMethod,
    setIsNextDisabled,
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
    setServiceLevel,
    setPayNow,
    setUser,
    setBillingAddress,
    resetSelectedCards,
    setPreviewTotal,
    clearSubmissionState,
    setSaveShippingAddress,
    setShippingFee,
} = adminCreateOrderSlice.actions;

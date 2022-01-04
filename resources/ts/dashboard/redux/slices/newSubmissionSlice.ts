import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    agsDiscountedAmount: number;
    currentStep: number;
    step01Status: any;
    orderID: number;
    grandTotal: number;
    orderNumber: string;
    couponState: {
        isCouponValid: boolean;
        couponCode: string;
        validCouponId: number;
        isCouponApplied: boolean;
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
    grandTotal: 0,
    orderNumber: '',
    agsDiscountedAmount: 0,
    isNextDisabled: false,
    isNextLoading: false,
    currentStep: 0,
    couponState: {
        isCouponValid: false,
        couponCode: '',
        validCouponId: -1,
        isCouponApplied: false,
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

const initialState1: NewSubmissionSliceState = {
    orderID: 42,
    grandTotal: 34,
    totalInAgs: 0,
    agsDiscountedAmount: 20,
    orderNumber: 'RG000000042',
    isNextDisabled: false,
    isNextLoading: false,
    currentStep: 4,
    couponState: {
        isCouponValid: false,
        couponCode: '',
        validCouponId: -1,
        isCouponApplied: false,
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
            {
                id: 2,
                type: 'card',
                maxProtectionAmount: 1000,
                turnaround: '12-14 Day',
                price: 50,
            },
            {
                id: 17,
                type: 'card',
                maxProtectionAmount: 2301,
                turnaround: '18 Day Turnaround',
                price: 3715,
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
        searchValue: 'd',
        searchResults: [],
        selectedCards: [
            {
                image: 'https://den-cards.pokellector.com/305/Bellsprout.SWSH05.1.37528.png',
                name: 'Sigmund',
                longName: '2003 Ally Samanta Dock 115',
                shortName: '1st Edition - Reverse Holo - Next Destinies Stage 1 Blisters',
                id: 104,
                qty: 1,
                value: 1,
            },
        ],
        shippingFee: 14,
        isMobileSearchModalOpen: false,
    },
    step03Data: {
        existingAddresses: [
            {
                id: 14,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
            {
                id: 15,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
            {
                id: 16,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
            {
                id: 17,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
            {
                id: 18,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
            {
                id: 19,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
            {
                id: 20,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
            {
                id: 21,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
            {
                id: 22,
                userId: 1,
                firstName: 'asd',
                lastName: 'Cepoi',
                address: 'Arad, Strada bumbacului',
                zipCode: '300446',
                phoneNumber: '+1 (723) 513-124',
                flat: '',
                city: 'Timişoara',
                state: {
                    id: 4,
                    code: 'AZ',
                    name: 'Arizona',
                },
                country: {
                    id: 1,
                    code: 'US',
                    name: 'United States',
                },
            },
        ],
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
            id: 14,
            userId: 1,
            firstName: 'asd',
            lastName: 'Cepoi',
            address: 'Arad, Strada bumbacului',
            zipCode: '300446',
            phoneNumber: '+1 (723) 513-124',
            flat: '',
            city: 'Timişoara',
            state: {
                id: 4,
                code: 'AZ',
                name: 'Arizona',
            },
            country: {
                id: 1,
                code: 'US',
                name: 'United States',
            },
        },
        availableStatesList: [
            {
                id: 1,
                code: 'AL',
                name: 'Alabama',
            },
            {
                id: 2,
                code: 'AK',
                name: 'Alaska',
            },
            {
                id: 3,
                code: 'AS',
                name: 'American Samoa',
            },
            {
                id: 4,
                code: 'AZ',
                name: 'Arizona',
            },
            {
                id: 5,
                code: 'AR',
                name: 'Arkansas',
            },
            {
                id: 6,
                code: 'CA',
                name: 'California',
            },
            {
                id: 7,
                code: 'CO',
                name: 'Colorado',
            },
            {
                id: 8,
                code: 'CT',
                name: 'Connecticut',
            },
            {
                id: 9,
                code: 'DE',
                name: 'Delaware',
            },
            {
                id: 10,
                code: 'DC',
                name: 'District Of Columbia',
            },
            {
                id: 11,
                code: 'FM',
                name: 'Federated States Of Micronesia',
            },
            {
                id: 12,
                code: 'FL',
                name: 'Florida',
            },
            {
                id: 13,
                code: 'GA',
                name: 'Georgia',
            },
            {
                id: 14,
                code: 'GU',
                name: 'Guam',
            },
            {
                id: 15,
                code: 'HI',
                name: 'Hawaii',
            },
            {
                id: 16,
                code: 'ID',
                name: 'Idaho',
            },
            {
                id: 17,
                code: 'IL',
                name: 'Illinois',
            },
            {
                id: 18,
                code: 'IN',
                name: 'Indiana',
            },
            {
                id: 19,
                code: 'IA',
                name: 'Iowa',
            },
            {
                id: 20,
                code: 'KS',
                name: 'Kansas',
            },
            {
                id: 21,
                code: 'KY',
                name: 'Kentucky',
            },
            {
                id: 22,
                code: 'LA',
                name: 'Louisiana',
            },
            {
                id: 23,
                code: 'ME',
                name: 'Maine',
            },
            {
                id: 24,
                code: 'MH',
                name: 'Marshall Islands',
            },
            {
                id: 25,
                code: 'MD',
                name: 'Maryland',
            },
            {
                id: 26,
                code: 'MA',
                name: 'Massachusetts',
            },
            {
                id: 27,
                code: 'MI',
                name: 'Michigan',
            },
            {
                id: 28,
                code: 'MN',
                name: 'Minnesota',
            },
            {
                id: 29,
                code: 'MS',
                name: 'Mississippi',
            },
            {
                id: 30,
                code: 'MO',
                name: 'Missouri',
            },
            {
                id: 31,
                code: 'MT',
                name: 'Montana',
            },
            {
                id: 32,
                code: 'NE',
                name: 'Nebraska',
            },
            {
                id: 33,
                code: 'NV',
                name: 'Nevada',
            },
            {
                id: 34,
                code: 'NH',
                name: 'New Hampshire',
            },
            {
                id: 35,
                code: 'NJ',
                name: 'New Jersey',
            },
            {
                id: 36,
                code: 'NM',
                name: 'New Mexico',
            },
            {
                id: 37,
                code: 'NY',
                name: 'New York',
            },
            {
                id: 38,
                code: 'NC',
                name: 'North Carolina',
            },
            {
                id: 39,
                code: 'ND',
                name: 'North Dakota',
            },
            {
                id: 40,
                code: 'MP',
                name: 'Northern Mariana Islands',
            },
            {
                id: 41,
                code: 'OH',
                name: 'Ohio',
            },
            {
                id: 42,
                code: 'OK',
                name: 'Oklahoma',
            },
            {
                id: 43,
                code: 'OR',
                name: 'Oregon',
            },
            {
                id: 44,
                code: 'PW',
                name: 'Palau',
            },
            {
                id: 45,
                code: 'PA',
                name: 'Pennsylvania',
            },
            {
                id: 46,
                code: 'PR',
                name: 'Puerto Rico',
            },
            {
                id: 47,
                code: 'RI',
                name: 'Rhode Island',
            },
            {
                id: 48,
                code: 'SC',
                name: 'South Carolina',
            },
            {
                id: 49,
                code: 'SD',
                name: 'South Dakota',
            },
            {
                id: 50,
                code: 'TN',
                name: 'Tennessee',
            },
            {
                id: 51,
                code: 'TX',
                name: 'Texas',
            },
            {
                id: 52,
                code: 'UT',
                name: 'Utah',
            },
            {
                id: 53,
                code: 'VT',
                name: 'Vermont',
            },
            {
                id: 54,
                code: 'VI',
                name: 'Virgin Islands',
            },
            {
                id: 55,
                code: 'VA',
                name: 'Virginia',
            },
            {
                id: 56,
                code: 'WA',
                name: 'Washington',
            },
            {
                id: 57,
                code: 'WV',
                name: 'West Virginia',
            },
            {
                id: 58,
                code: 'WI',
                name: 'Wisconsin',
            },
            {
                id: 59,
                code: 'WY',
                name: 'Wyoming',
            },
            {
                id: 60,
                code: 'delectus',
                name: 'Mississippi',
            },
            {
                id: 61,
                code: 'animi',
                name: 'Maryland',
            },
            {
                id: 62,
                code: 'non',
                name: 'North Dakota',
            },
            {
                id: 63,
                code: 'sed',
                name: 'Iowa',
            },
            {
                id: 64,
                code: 'expedita',
                name: 'Nebraska',
            },
        ],
        fetchingStatus: 'success',
        saveForLater: true,
        disableAllShippingInputs: true,
        useCustomShippingAddress: false,
    },
    step04Data: {
        paymentMethodId: 1,
        existingCreditCards: [
            {
                expMonth: 4,
                expYear: 2024,
                last4: '4242',
                brand: 'visa',
                id: 'pm_1K9suqJCai8r8pbfoihuST3s',
            },
            {
                expMonth: 4,
                expYear: 2024,
                last4: '4242',
                brand: 'visa',
                id: 'pm_1K9qtfJCai8r8pbfVd9ATj9K',
            },
        ],
        availableStatesList: [],
        selectedCreditCard: {
            expMonth: 4,
            expYear: 2024,
            last4: '4242',
            brand: 'visa',
            id: 'pm_1K9suqJCai8r8pbfoihuST3s',
        },
        saveForLater: true,
        useShippingAddressAsBillingAddress: true,
        selectedBillingAddress: {
            id: 52,
            userId: 1,
            firstName: 'asd',
            lastName: 'Cepoi',
            address: 'Arad, Strada bumbacului',
            zipCode: '300446',
            phoneNumber: '+1 (723) 513-124',
            city: 'Timişoara',
            state: {
                id: 4,
                code: 'AZ',
                name: 'Arizona',
            },
            country: {
                id: 1,
                code: 'US',
                name: 'United States',
            },
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

export const getTotalInAGS = createAsyncThunk(
    'newSubmission/getTotalInAGS',
    async (input: { orderID: number; chainID: number }) => {
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint(`customer/orders/${input.orderID}/ags?network=${input?.chainID}`);
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
        coupon: currentSubmission.couponState.isCouponApplied
            ? {
                  code: currentSubmission?.couponState?.couponCode,
                  id: currentSubmission?.couponState?.appliedCouponData.id,
              }
            : null,
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
        clearSubmissionState: (state) => initialState,
        resetCouponState: (state) => {
            state.couponState = {
                isCouponValid: false,
                couponCode: '',
                validCouponId: -1,
                isCouponApplied: false,
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
        [getTotalInAGS.fulfilled as any]: (state, action) => {
            state.totalInAgs = action.payload;
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
            state.agsDiscountedAmount = action.payload.agsDiscountedAmount;
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
} = newSubmissionSlice.actions;

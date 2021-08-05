import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
}

export interface Address {
    firstName: string;
    lastName: string;
    address: string;
    apt?: string;
    city: string;
    state: { name: string; code: string; id: number };
    zipCode: string;
    phoneNumber: string;
}

export interface CreditCard {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
}

export interface ShippingSubmissionState {
    existingAddresses?: Address[];
    selectedAddress: Address;
    availableStatesList: { name: string; code: string; id: number }[];
    saveForLater: boolean;
    fetchingStatus: string | null;
}

export interface PaymentSubmissionState {
    paymentMethodId: number;
    existingCreditCards?: CreditCard[];
    selectedCreditCard: CreditCard;
    availableStatesList: { name: string; id: number }[];
    saveForLater: boolean;
    fetchingStatus: string | null;
}

export interface PaymentSubmissionState {
    paymentMethodId: number;
    existingCreditCards?: CreditCard[];
    selectedCreditCard: CreditCard;
    saveForLater: boolean;
    useShippingAddressAsBillingAddress: boolean;
    selectedBillingAddress: Address;
    existingBillingAddresses: Address[];
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
    currentStep: 4,
    step01Status: null,
    step01Data: {
        availableServiceLevels: [
            {
                id: 10,
                type: 'card',
                maxProtectionAmount: 93024876.14,
                turnaround: 'officiis',
                price: 95507705,
            },
            {
                id: 2,
                type: 'card',
                maxProtectionAmount: 96041905.29,
                turnaround: 'quam',
                price: 13227737.9,
            },
            {
                id: 13,
                type: 'card',
                maxProtectionAmount: 5942436.96,
                turnaround: 'autem',
                price: 92955693.13,
            },
            {
                id: 14,
                type: 'card',
                maxProtectionAmount: 87257439.92,
                turnaround: 'laboriosam',
                price: 82438212.51,
            },
            {
                id: 11,
                type: 'card',
                maxProtectionAmount: 51800372.87,
                turnaround: 'cupiditate',
                price: 1932963.9,
            },
            {
                id: 15,
                type: 'card',
                maxProtectionAmount: 61858651.2,
                turnaround: 'voluptate',
                price: 84941436.35,
            },
            {
                id: 5,
                type: 'card',
                maxProtectionAmount: 22211364.25,
                turnaround: 'cumque',
                price: 46535423.55,
            },
            {
                id: 8,
                type: 'card',
                maxProtectionAmount: 80843031.68,
                turnaround: 'nobis',
                price: 62358957.73,
            },
            {
                id: 3,
                type: 'card',
                maxProtectionAmount: 13981107.66,
                turnaround: 'nulla',
                price: 66525210.83,
            },
            {
                id: 9,
                type: 'card',
                maxProtectionAmount: 71129132.6,
                turnaround: 'qui',
                price: 73095044.18,
            },
            {
                id: 1,
                type: 'card',
                maxProtectionAmount: 70018862.7,
                turnaround: 'quibusdam',
                price: 30010461.37,
            },
            {
                id: 4,
                type: 'card',
                maxProtectionAmount: 11574619.45,
                turnaround: 'voluptas',
                price: 58655545.41,
            },
            {
                id: 7,
                type: 'card',
                maxProtectionAmount: 29881724.1,
                turnaround: 'ut',
                price: 21860428.11,
            },
            {
                id: 12,
                type: 'card',
                maxProtectionAmount: 49976861.05,
                turnaround: 'non',
                price: 87745330.39,
            },
            {
                id: 6,
                type: 'card',
                maxProtectionAmount: 47870887.09,
                turnaround: 'harum',
                price: 27314338.24,
            },
        ],
        selectedServiceLevel: {
            id: 10,
            type: 'card',
            maxProtectionAmount: 93024876.14,
            turnaround: 'officiis',
            price: 95507705,
        },
        status: 'success',
    },
    step02Data: {
        searchValue: 'asd',
        searchResults: [
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 1,
            },
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard 2',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 2,
            },
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard 3',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 4,
            },
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard 4',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 5,
            },
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard 5',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 6,
            },
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard 6',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 8,
            },
        ],
        selectedCards: [
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard 5',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 6,
                qty: 1,
                value: 1,
            },
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard 3',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 4,
                qty: 1,
                value: 1,
            },
            {
                image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                title: 'Charizard 4',
                subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                id: 5,
                qty: 1,
                value: 1,
            },
        ],
    },
    step03Data: {
        existingAddresses: [],
        selectedAddress: {
            firstName: 'Emanuel',
            lastName: 'Cepoi',
            address: '36 Bujorilor',
            apt: '05',
            city: 'New York',
            state: {
                name: 'New York',
                id: 37,
                code: 'NY',
            },
            zipCode: '123123',
            phoneNumber: '+1 (123) 123-2131',
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
                code: 'cumque',
                name: 'Prof. Marlen Wisozk',
            },
            {
                id: 61,
                code: 'consequatur',
                name: 'Madge Watsica',
            },
            {
                id: 62,
                code: 'deleniti',
                name: 'Marta Quigley',
            },
            {
                id: 63,
                code: 'nulla',
                name: 'Annabell Kerluke',
            },
            {
                id: 64,
                code: 'consequatur',
                name: 'Dr. Alberta Schmidt DVM',
            },
        ],
        fetchingStatus: 'success',
        saveForLater: true,
    },
    step04Data: {
        paymentMethodId: 1,
        existingCreditCards: [],
        availableStatesList: [],
        selectedCreditCard: {
            cardNumber: '',
            expirationDate: '',
            cvv: '',
        },
        saveForLater: true,
        useShippingAddressAsBillingAddress: true,
        selectedBillingAddress: {
            firstName: 'Emanuel',
            lastName: 'Cepoi',
            address: '36 Bujorilor',
            apt: '05',
            city: 'New York',
            state: {
                name: 'New York',
                id: 37,
                code: 'NY',
            },
            zipCode: '123123',
            phoneNumber: '+1 (123) 123-2131',
        },
        existingBillingAddresses: [],
        fetchingStatus: null,
    },
};

export const getServiceLevels = createAsyncThunk('newSubmission/getServiceLevels', async () => {
    const serviceLevels = await axios.get('http://robograding.test/api/customer/orders/payment-plans/');
    const formatedServiceLevels = serviceLevels.data.data.map((serviceLevel: any) => {
        return {
            id: serviceLevel.id,
            type: 'card',
            maxProtectionAmount: serviceLevel.max_protection_amount,
            turnaround: serviceLevel.turnaround,
            price: serviceLevel.price,
        };
    });

    return formatedServiceLevels;
});

export const getStatesList = createAsyncThunk('newSubmission/getStatesList', async () => {
    const americanStates = await axios.get('http://robograding.test/api/customer/addresses/states');
    return americanStates.data.data;
});

const newSubmissionSlice = createSlice({
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
            state.step02Data.searchResults = [
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 1,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 2',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 2,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 3',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 4,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 4',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 5,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 5',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 6,
                },
                {
                    image: 'https://i.ibb.co/8b0CskT/Dummy-Charizard.png',
                    title: 'Charizard 6',
                    subtitle: '2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard',
                    id: 8,
                },
            ];
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
        setBillingAddressEqualToShippingAddress: (state, action: PayloadAction<void>) => {
            state.step04Data.selectedBillingAddress = state.step03Data.selectedAddress;
        },
    },
    extraReducers: {
        [getServiceLevels.pending as any]: (state, action) => {
            state.step01Data.status = 'loading';
        },
        [getServiceLevels.fulfilled as any]: (state, action: any) => {
            state.step01Data.availableServiceLevels = action.payload;
            state.step01Data.selectedServiceLevel = action.payload[0];
            state.step01Data.status = 'success';
        },
        [getServiceLevels.rejected as any]: (state, action) => {
            state.step01Data.status = 'failed';
        },
        [getStatesList.pending as any]: (state, action) => {
            state.step03Data.fetchingStatus = 'loading';
        },
        [getStatesList.fulfilled as any]: (state, action) => {
            state.step03Data.availableStatesList = action.payload;
            state.step03Data.fetchingStatus = 'success';
        },
        [getStatesList.rejected as any]: (state, action) => {
            console.log(action);
            state.step03Data.fetchingStatus = 'failed';
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
    setBillingAddressEqualToShippingAddress,
} = newSubmissionSlice.actions;
export default newSubmissionSlice.reducer;

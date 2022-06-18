import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

interface Address {
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

interface NewAddressState {
    shippingAddress: Address;
    availableStatesList: { name: string; code: string; id: number }[];
    availableCountriesList: { name: string; code: string; id: number; phoneCode: string }[];
}

const initialState: NewAddressState = {
    shippingAddress: {
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
};

export const addNewShippingAddress = createAsyncThunk(
    'newAddress/createShippingAddress',
    async (_, { getState }: any) => {
        const newAddress: NewAddressState = getState().newAddressSlice;

        const parsedName = parseName(newAddress.shippingAddress.firstName);

        console.log('New ', newAddress);
        const DTO = {
            shippingAddress: {
                firstName: parsedName?.firstName,
                lastName: parsedName?.lastName,
                address: newAddress.shippingAddress.address,
                address2: newAddress.shippingAddress.address2,
                city: newAddress.shippingAddress.city,
                state: newAddress.shippingAddress.state?.code || newAddress.shippingAddress.stateName,
                countryCode: newAddress.shippingAddress.country?.code,
                zip: newAddress.shippingAddress.zipCode,
                phone: newAddress.shippingAddress.phoneNumber,
            },
        };
        const apiService = app(APIService);
        const endpoint = apiService.createEndpoint('customer/addresses');
        const address = await endpoint.post('', DTO);
        console.log('add ', address);
        return address.data;
    },
);

const parseName = (fullName: any) => {
    const value = fullName.trim();
    const firstSpace = value.indexOf(' ');
    if (firstSpace === -1) {
        return { firstName: value, lastName: null };
    }

    const firstName = value.slice(0, firstSpace);
    const lastName = value.slice(firstSpace + 1);

    return { firstName, lastName };
};

export const getStatesList = createAsyncThunk('newAddress/getStatesList', async (input?: { countryId: number }) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(
        `customer/addresses/states?country_id= ${input?.countryId ? input?.countryId : 1}`,
    );
    const americanStates = await endpoint.get('');
    return americanStates.data;
});

export const getCountriesList = createAsyncThunk('newAddress/getCountriesList', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/addresses/countries');
    const countries = await endpoint.get('');
    return countries.data;
});

export const newAddressSlice = createSlice({
    name: 'newAddressSlice',
    initialState,
    reducers: {
        updateShippingAddressField: (state, action: PayloadAction<{ fieldName: string; newValue: any }>) => {
            // @ts-ignore
            state.shippingAddress[action.payload.fieldName] = action.payload.newValue;
        },
    },
    extraReducers: {
        [getCountriesList.fulfilled as any]: (state, action) => {
            state.availableCountriesList = action.payload;
        },
        [getStatesList.fulfilled as any]: (state, action) => {
            state.availableStatesList = action.payload;
        },
    },
});

export const { updateShippingAddressField } = newAddressSlice.actions;

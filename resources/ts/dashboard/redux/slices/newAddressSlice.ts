import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

interface Address {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    address: string;
    address2?: string;
    city: string;
    country: { name: string; code: string; id: number; phoneCode: string };
    state?: { name: string; code: string; id: number };
    stateName?: string;
    zip: string;
    phone: string;
    id: number;
}

interface NewAddressState {
    existingAddresses: Address[] | [];
    shippingAddress: Address;
    availableStatesList: { name: string; code: string; id: number }[];
    availableCountriesList: { name: string; code: string; id: number; phoneCode: string }[];
}

const initialState: NewAddressState = {
    existingAddresses: [],
    shippingAddress: {
        fullName: '',
        lastName: '',
        address: '',
        address2: '',
        city: '',
        state: {
            id: 0,
            code: '',
            name: '',
        },
        zip: '',
        phone: '',
        country: {
            id: 0,
            code: '',
            name: '',
            phoneCode: '',
        },
        id: -1,
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

export const getSingleAddress = createAsyncThunk('newAddress/getSingleAddress', async (addressId: any) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(`customer/addresses/${addressId}`);
    const customerAddress = await endpoint.get('');
    return customerAddress.data;
});

export const getSavedAddresses = createAsyncThunk('newAddress/getSavedAddresses', async (_, { getState }: any) => {
    const availableStatesList: any = getState().newAddressSlice.availableStatesList;
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
});

export const addNewShippingAddress = createAsyncThunk(
    'newAddress/addNewShippingAddress',
    async (_, { getState }: any) => {
        const newAddress: NewAddressState = getState().newAddressSlice;
        const parsedName = parseName(newAddress.shippingAddress.fullName);

        const addressDTO = {
            shippingAddress: {
                countryId: newAddress.shippingAddress.country.id ? newAddress.shippingAddress.country.id : 1,
                firstName: parsedName?.firstName,
                lastName: parsedName?.lastName,
                address: newAddress.shippingAddress.address,
                address2: newAddress.shippingAddress.address2,
                city: newAddress.shippingAddress.city,
                state: newAddress.shippingAddress.state?.code
                    ? newAddress.shippingAddress.state?.code
                    : newAddress.shippingAddress.stateName,
                countryCode: newAddress.shippingAddress.country?.phoneCode,
                zip: newAddress.shippingAddress.zip,
                phone: newAddress.shippingAddress.phone,
            },
        };

        try {
            const apiService = app(APIService);
            const endpoint = apiService.createEndpoint('customer/addresses');
            const address = await endpoint.post('', addressDTO);
            NotificationsService.success('Created successfully!');
            return address.data;
        } catch (e: any) {
            NotificationsService.exception(e);
        }
    },
);

export const updateShippingAddress = createAsyncThunk(
    'newAddress/updateShippingAddress',
    async (addressId: any, { getState }: any) => {
        const newAddress: NewAddressState = getState().newAddressSlice;
        const parsedName = parseName(newAddress.shippingAddress.fullName);

        const updateAddressDTO = {
            shippingAddress: {
                countryId: newAddress.shippingAddress.country.id || 1,
                firstName: parsedName?.firstName,
                lastName: parsedName?.lastName,
                address: newAddress.shippingAddress.address,
                address2: newAddress.shippingAddress.address2,
                city: newAddress.shippingAddress.city,
                state: newAddress.shippingAddress.state?.code
                    ? newAddress.shippingAddress.state?.code
                    : newAddress.shippingAddress.stateName,
                countryCode: newAddress.shippingAddress.country?.phoneCode,
                zip: newAddress.shippingAddress.zip,
                phone: newAddress.shippingAddress.phone,
            },
        };
        try {
            const apiService = app(APIService);
            const endpoint = apiService.createEndpoint(`customer/addresses/${addressId}`);
            const address = await endpoint.put('', updateAddressDTO);
            NotificationsService.success('Updated successfully!');
            return address.data;
        } catch (e: any) {
            NotificationsService.exception(e);
        }
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
        [getSavedAddresses.fulfilled as any]: (state, action) => {
            state.existingAddresses = action.payload;
        },
        [getSingleAddress.fulfilled as any]: (state, action) => {
            state.shippingAddress = {
                ...state.shippingAddress,
                fullName: action.payload.firstName + ' ' + action.payload.lastName,
                country: action.payload.country,
                address: action.payload.address,
                address2: action.payload.address2,
                state: action.payload.state,
                stateName: action.payload.state,
                zip: action.payload.zip,
                phone: action.payload.phone,
                city: action.payload.city,
            };
        },
    },
});

export const { updateShippingAddressField } = newAddressSlice.actions;

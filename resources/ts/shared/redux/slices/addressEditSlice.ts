import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

interface AddressEditState {
    availableStatesList: { name: string; code: string; id: number }[];
    availableCountriesList: { name: string; code: string; id: number; phoneCode: string }[];
}

const initialState: AddressEditState = {
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

export const getStatesList = createAsyncThunk('addressEdit/getStatesList', async (input?: { countryId: number }) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(
        `customer/addresses/states?country_id= ${input?.countryId ? input?.countryId : 1}`,
    );
    const states = await endpoint.get('');
    return states.data;
});

export const getCountriesList = createAsyncThunk('addressEdit/getCountriesList', async () => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint('customer/addresses/countries');
    const countries = await endpoint.get('');
    return countries.data;
});

export const addressEditSlice = createSlice({
    name: 'addressEditSlice',
    initialState,
    reducers: {
        updateCustomerAddressField: (state, action: PayloadAction<{ fieldName: string; newValue: any }>) => {
            // @ts-ignore
            state.customerAddress[action.payload.fieldName] = action.payload.newValue;
        },
        emptyCustomerAddress: (state, action: PayloadAction<{}>) => {
            // @ts-ignore
            state.customerAddress = action.payload;
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

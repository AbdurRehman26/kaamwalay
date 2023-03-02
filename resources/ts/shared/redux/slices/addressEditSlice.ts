import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { app } from '@shared/lib/app';
import { APIService } from '@shared/services/APIService';

// import { NotificationsService } from '@shared/services/NotificationsService';
//
// interface Address {
//     fullName?: string;
//     firstName?: string;
//     lastName?: string;
//     address: string;
//     address2?: string;
//     city: string;
//     country: { name: string; code: string; id: number; phoneCode: string };
//     state?: { name: string; code: string; id: number };
//     stateName?: string;
//     zip: string;
//     phone: string;
//     id: number;
// }

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
//
// export const updateCustomerAddress = createAsyncThunk(
//     'addressEdit/updateCustomerAddress',
//     async (addressId: any, { getState }: any) => {
//         const addressEdit: AddressEditState = getState().addressEditSlice;
//         const parsedName = parseName(addressEdit.customerAddress.fullName);
//
//         const updateAddressDTO = {
//             countryId: addressEdit.customerAddress.country.id || 1,
//             firstName: parsedName?.firstName,
//             lastName: parsedName?.lastName,
//             address: addressEdit.customerAddress.address,
//             address2: addressEdit.customerAddress.address2,
//             city: addressEdit.customerAddress.city,
//             state: addressEdit.customerAddress.state?.code
//                 ? addressEdit.customerAddress.state?.code
//                 : addressEdit.customerAddress.stateName,
//             countryCode: addressEdit.customerAddress.country?.phoneCode,
//             zip: addressEdit.customerAddress.zip,
//             phone: addressEdit.customerAddress.phone,
//         };
//         try {
//             const apiService = app(APIService);
//             const endpoint = apiService.createEndpoint(`customer/addresses/${addressId}`);
//             const address = await endpoint.put('', updateAddressDTO);
//             NotificationsService.success('Updated successfully!');
//             return address.data;
//         } catch (e: any) {
//             NotificationsService.exception(e);
//         }
//     },
// );
//
// const parseName = (fullName: any) => {
//     const value = fullName.trim();
//     const firstSpace = value.indexOf(' ');
//     if (firstSpace === -1) {
//         return { firstName: value, lastName: null };
//     }
//
//     const firstName = value.slice(0, firstSpace);
//     const lastName = value.slice(firstSpace + 1);
//
//     return { firstName, lastName };
// };

export const getStatesList = createAsyncThunk('addressEdit/getStatesList', async (input?: { countryId: number }) => {
    const apiService = app(APIService);
    const endpoint = apiService.createEndpoint(
        `customer/addresses/states?country_id= ${input?.countryId ? input?.countryId : 1}`,
    );
    const americanStates = await endpoint.get('');
    return americanStates.data;
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

// export const { updateCustomerAddressField, emptyCustomerAddress } = addressEditSlice.actions;

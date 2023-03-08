import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface EditCustomerState {
    customer: { id: number; firstName: string; lastName: string; email: string; phone: string };
}

const initialState: EditCustomerState = {
    customer: { id: 0, firstName: '', lastName: '', email: '', phone: '' },
};

export const editCustomerSlice = createSlice({
    name: 'editCustomerSlice',
    initialState,
    reducers: {
        setCustomer: (
            state,
            action: PayloadAction<{ id: number; firstName: string; lastName: string; email: string; phone: string }>,
        ) => {
            // @ts-ignore
            state.customer = action.payload;
        },
        emptyCustomerAddress: (state, action: PayloadAction<{}>) => {
            // @ts-ignore
            state.customerAddress = action.payload;
        },
    },
});

export const { setCustomer } = editCustomerSlice.actions;

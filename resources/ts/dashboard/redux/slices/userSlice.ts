import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    username: string;
    stripeID: string;
}

const initialState: UserState = {
    username: '',
    stripeID: 'cus_JznJFVaa5nnDfj',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
    },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;

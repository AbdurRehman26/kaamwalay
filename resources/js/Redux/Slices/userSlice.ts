import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    username: String;
}

const initialState: UserState = {
    username: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        }
    }
})

export const { login } = userSlice.actions;
export default userSlice.reducer;
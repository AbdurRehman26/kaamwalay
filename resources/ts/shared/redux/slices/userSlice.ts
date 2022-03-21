import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ChangeUserPasswordDTO } from '@shared/dto/ChangeUserPasswordDTO';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { UpdateUserProfileDTO } from '@shared/dto/UpdateUserProfileDTO';
import { app } from '@shared/lib/app';
import { updateUserProfileData } from '@shared/redux/slices/authenticationSlice';
import { UserRepository } from '@shared/repositories/UserRepository';
import { AuthenticationService } from '@shared/services/AuthenticationService';
import { NotificationsService } from '@shared/services/NotificationsService';

export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (input: UpdateUserProfileDTO, thunkAPI) => {
        const userRepository = app(UserRepository);
        try {
            const data = await userRepository.updateUserProfile(input);
            thunkAPI.dispatch(updateUserProfileData(data));
            NotificationsService.success('Profile updated successfully!');
        } catch (error: any) {
            NotificationsService.exception(error);
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const confirmPasswordWithAGS = createAsyncThunk(
    'user/confirmPasswordWithAGS',
    async (input: LoginRequestDto, thunkAPI) => {
        const userRepository = app(UserRepository);
        try {
            await userRepository.confirmPasswordWithAGS(input);
            NotificationsService.success('Profile updated successfully!');
        } catch (error: any) {
            NotificationsService.exception(error);
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const updateUserPassword = createAsyncThunk(
    'user/updateUserPassword',
    async (input: ChangeUserPasswordDTO, thunkAPI) => {
        const authenticationService = app(AuthenticationService);
        const userRepository = app(UserRepository);
        try {
            const data = await userRepository.updateUserPassword(input);
            await authenticationService.setAccessToken(data.accessToken);
            NotificationsService.success('Password changed successfully!');
        } catch (error: any) {
            NotificationsService.exception(error);
            return thunkAPI.rejectWithValue(error);
        }
    },
);

export const userSlice = createSlice({
    name: 'userSlice',
    initialState: {},
    reducers: {},
    extraReducers: {
        [updateUserProfile.rejected as any]: (state, action) => {
            return action.payload;
        },
    },
});

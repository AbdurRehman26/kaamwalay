import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { classToPlain } from 'class-transformer';

import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { AuthenticatedUserEntity } from '@shared/entities/AuthenticatedUserEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { app } from '@shared/lib/app';
import { AuthenticationRepository } from '@shared/repositories/AuthenticationRepository';
import { AuthenticationService } from '@shared/services/AuthenticationService';
import { NotificationsService } from '@shared/services/NotificationsService';

import { ResetPasswordRequestDto } from '../../dto/ResetPasswordRequestDto';

interface StateType {
    checking: boolean;
    authenticated: boolean;
    accessToken: string | null;
    user: UserEntity | null;
}

type AuthenticatePayload = PayloadAction<AuthenticatedUserEntity, string, any, Error>;

export const authenticateAction = createAsyncThunk('auth/authenticate', async (input: LoginRequestDto) => {
    const authenticationService = app(AuthenticationService);
    const authenticationRepository = app(AuthenticationRepository);

    try {
        const authenticatedUser = await authenticationRepository.postLogin(input);
        NotificationsService.success('Login successfully!');
        await authenticationService.setAccessToken(authenticatedUser.accessToken);

        // serialize class objects to plain objects according redux toolkit error
        return classToPlain(authenticatedUser);
    } catch (e) {
        if (e.errors) {
            NotificationsService.error('Validation errors.');
        } else if (e.isAxiosError) {
            NotificationsService.error(e.message);
        } else {
            NotificationsService.error('Unable to login.');
        }

        throw e;
    }
});

export const registerAction = createAsyncThunk('auth/register', async (input: SignUpRequestDto, thunkAPI) => {
    const authenticationService = app(AuthenticationService);
    const authenticationRepository = app(AuthenticationRepository);

    try {
        const authenticatedUser = await authenticationRepository.postRegister(input);
        NotificationsService.success('Register successfully!');
        await authenticationService.setAccessToken(authenticatedUser.accessToken);

        thunkAPI.dispatch(authenticateCheckAction());
    } catch (e) {
        if (e.errors) {
            NotificationsService.error('Validation errors.');
        } else if (e.isAxiosError) {
            NotificationsService.error(e.message);
        } else {
            NotificationsService.error('Unable to register.');
        }

        throw e;
    }
});

export const authenticateCheckAction = createAsyncThunk('auth/check', async () => {
    const authenticationService = app(AuthenticationService);
    const authenticationRepository = app(AuthenticationRepository);
    const accessToken = await authenticationService.getAccessToken();
    if (!accessToken) {
        return null;
    }

    const user = await authenticationRepository.whoami();
    return {
        accessToken,
        user: classToPlain(user),
    };
});

export const revokeAuthAction = createAsyncThunk('auth/revoke', async () => {
    const authenticationService = app(AuthenticationService);
    await authenticationService.removeAccessToken();
});

export const forgotPasswordAction = createAsyncThunk('auth/password/forgot', async (email: string) => {
    const authenticationRepository = app(AuthenticationRepository);
    return authenticationRepository.forgotPassword(email);
});

export const resetPasswordAction = createAsyncThunk('auth/password/reset', async (input: ResetPasswordRequestDto) => {
    const authenticationRepository = app(AuthenticationRepository);
    try {
        return await authenticationRepository.resetPassword(input);
    } catch (e) {
        if (e.errors) {
            throw new Error('Validation error.');
        }

        throw e;
    }
});

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
        checking: true,
        authenticated: false,
        accessToken: null,
        user: null,
    } as StateType,
    reducers: {},
    extraReducers: {
        [authenticateAction.rejected as any]: (state) => {
            state.authenticated = false;
            state.checking = false;
        },
        [authenticateAction.pending as any]: (state) => {
            state.authenticated = false;
            state.checking = true;
        },
        [authenticateAction.fulfilled as any]: (state, { payload }: AuthenticatePayload) => {
            state.accessToken = payload.accessToken;
            state.user = payload.user;
            state.authenticated = true;
            state.checking = false;
        },

        [authenticateCheckAction.rejected as any]: (state) => {
            state.authenticated = false;
            state.checking = false;
        },
        [authenticateCheckAction.pending as any]: (state) => {
            state.authenticated = false;
            state.checking = true;
        },
        [authenticateCheckAction.fulfilled as any]: (state, { payload }: AuthenticatePayload) => {
            state.accessToken = payload?.accessToken ?? null;
            state.user = payload?.user ?? null;
            state.authenticated = !!payload;
            state.checking = false;
        },

        [revokeAuthAction.pending as any]: (state) => {
            state.authenticated = false;
            state.checking = true;
        },
        [revokeAuthAction.fulfilled as any]: (state) => {
            state.accessToken = null;
            state.user = null;
            state.authenticated = false;
            state.checking = false;
        },
    },
});

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { classToPlain } from 'class-transformer';

import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { AuthenticatedUserEntity } from '@shared/entities/AuthenticatedUserEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { resolveInjectable } from '@shared/lib/dependencyInjection/resolveInjectable';
import { AuthenticationRepository } from '@shared/repositories/AuthenticationRepository';
import { AuthenticationService } from '@shared/services/AuthenticationService';
import { NotificationsService } from '@shared/services/NotificationsService';

interface StateType {
    checking: boolean;
    authenticated: boolean;
    accessToken: string | null;
    user: UserEntity | null;
}

type AuthenticatePayload = PayloadAction<AuthenticatedUserEntity, string, any, Error>;

export const authenticateAction = createAsyncThunk('auth/authenticate', async (input: LoginRequestDto) => {
    const authenticationService = resolveInjectable(AuthenticationService);
    const authenticationRepository = resolveInjectable(AuthenticationRepository);

    try {
        const authenticatedUser = await authenticationRepository.postLogin(input);
        NotificationsService.success('Login successfully!');
        await authenticationService.setAccessToken(authenticatedUser.accessToken);

        // serialize class objects to plain objects according redux toolkit error
        return classToPlain(authenticatedUser);
    } catch (e) {
        if (e.errors) {
            NotificationsService.error('Validation errors.');
        }

        throw e;
    }
});

export const authenticateCheckAction = createAsyncThunk('auth/check', async () => {
    const authenticationService = resolveInjectable(AuthenticationService);
    const authenticationRepository = resolveInjectable(AuthenticationRepository);
    const accessToken = await authenticationService.getAccessToken();

    if (accessToken) {
        const user = await authenticationRepository.whoami();
        return {
            accessToken,
            user: classToPlain(user),
        };
    }

    return null;
});

export const revokeAuthAction = createAsyncThunk('auth/revoke', async () => {
    const authenticationService = resolveInjectable(AuthenticationService);
    await authenticationService.removeAccessToken();
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

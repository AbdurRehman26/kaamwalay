import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { classToPlain } from 'class-transformer';
import ReactGA from 'react-ga';
import { AuthenticationEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { AuthenticatedUserEntity } from '@shared/entities/AuthenticatedUserEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { isAxiosError } from '@shared/lib/api/isAxiosError';
import { app } from '@shared/lib/app';
import { isException } from '@shared/lib/errors/isException';
import { AuthenticationRepository } from '@shared/repositories/AuthenticationRepository';
import { AuthenticationService } from '@shared/services/AuthenticationService';
import { NotificationsService } from '@shared/services/NotificationsService';
import { ResetPasswordRequestDto } from '../../dto/ResetPasswordRequestDto';
import { trackFacebookPixelEvent } from '../../lib/utils/trackFacebookPixelEvent';
import { FacebookPixelEvents } from '../../constants/FacebookPixelEvents';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';

interface StateType {
    checking: boolean;
    authenticated: boolean;
    accessToken: string | null;
    user: UserEntity | null;
}

type AuthenticatePayload = PayloadAction<AuthenticatedUserEntity, string, any, Error>;

export const authenticateAction = createAsyncThunk('auth/authenticate', async (input: LoginRequestDto, thunkAPI) => {
    const authenticationService = app(AuthenticationService);
    const authenticationRepository = app(AuthenticationRepository);

    try {
        const authenticatedUser = await authenticationRepository.postLogin(input);
        NotificationsService.success('Login successfully!');
        ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.loggedIn });
        pushToDataLayer({ event: 'google-ads-authenticated' });
        await authenticationService.setAccessToken(authenticatedUser.accessToken);

        // serialize class objects to plain objects according redux toolkit error
        return classToPlain(authenticatedUser);
    } catch (e: any) {
        if (isAxiosError(e) || isException(e)) {
            ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.failedLogIn });
            NotificationsService.exception(e);
        } else {
            ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.failedLogIn });
            NotificationsService.error('Unable to login.');
        }

        return thunkAPI.rejectWithValue(e);
    }
});

export const registerAction = createAsyncThunk('auth/register', async (input: SignUpRequestDto, thunkAPI) => {
    const authenticationService = app(AuthenticationService);
    const authenticationRepository = app(AuthenticationRepository);

    try {
        const authenticatedUser = await authenticationRepository.postRegister(input);
        NotificationsService.success('Register successfully!');
        ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.registerSuccess });
        pushToDataLayer({ event: 'google-ads-authenticated' });
        await authenticationService.setAccessToken(authenticatedUser.accessToken);
        trackFacebookPixelEvent(FacebookPixelEvents.CompleteRegistration);
        thunkAPI.dispatch(authenticateCheckAction());
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
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

export const forgotPasswordAction = createAsyncThunk('auth/password/forgot', async (email: string, thunkAPI) => {
    const authenticationRepository = app(AuthenticationRepository);
    try {
        const forgotPasswordResponse = await authenticationRepository.forgotPassword(email);
        ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.sentResetLink });
        return forgotPasswordResponse;
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const resetPasswordAction = createAsyncThunk(
    'auth/password/reset',
    async (input: ResetPasswordRequestDto, thunkAPI) => {
        const authenticationRepository = app(AuthenticationRepository);
        try {
            const resetPasswordResponse = await authenticationRepository.resetPassword(input);
            ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.sentResetLink });
            return resetPasswordResponse;
        } catch (e: any) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
        checking: true,
        authenticated: false,
        accessToken: null,
        user: null,
    } as StateType,
    reducers: {
        updateUserProfileData: (state, action: PayloadAction<UserEntity>) => {
            state.user = action.payload;
        },
    },
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

export const { updateUserProfileData } = authenticationSlice.actions;

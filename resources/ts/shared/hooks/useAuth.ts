import { plainToClass } from 'class-transformer';
import { useCallback, useMemo } from 'react';
import { ResetPasswordRequestDto } from '../dto/ResetPasswordRequestDto';
import { SignUpRequestDto } from '../dto/SignUpRequestDto';
import { UserEntity } from '../entities/UserEntity';
import {
    authenticateAction,
    authenticateCheckAction,
    forgotPasswordAction,
    registerAction,
    resetPasswordAction,
    revokeAuthAction,
} from '../redux/slices/authenticationSlice';
import { useSharedDispatch } from './useSharedDispatch';
import { useSharedSelector } from './useSharedSelector';

export function useAuth() {
    const dispatch = useSharedDispatch();
    const accessToken = useSharedSelector((state) => state.authentication.accessToken);
    const user = useSharedSelector((state) => state.authentication.user);
    const authenticated = useSharedSelector((state) => state.authentication.authenticated);
    const checking = useSharedSelector((state) => state.authentication.checking);

    const user$ = useMemo<UserEntity>(() => plainToClass(UserEntity, user), [user]);

    const login = useCallback(
        (email: string, password: string) => dispatch(authenticateAction({ email, password })),
        [dispatch],
    );
    const register = useCallback((input: SignUpRequestDto) => dispatch(registerAction(input)), [dispatch]);
    const checkAuth = useCallback(() => dispatch(authenticateCheckAction()), [dispatch]);
    const logout = useCallback(() => dispatch(revokeAuthAction()), [dispatch]);
    const forgotPassword = useCallback((email: string) => dispatch(forgotPasswordAction(email)), [dispatch]);
    const resetPassword = useCallback(
        (input: ResetPasswordRequestDto) => dispatch(resetPasswordAction(input)),
        [dispatch],
    );

    return {
        user: user$,
        checkAuth,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        accessToken,
        authenticated,
        checking,
        dispatch,
    };
}

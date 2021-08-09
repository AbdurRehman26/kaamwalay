import { plainToClass } from 'class-transformer';
import objectHash from 'object-hash';
import { useCallback, useMemo } from 'react';

import { UserEntity } from '@shared/entities/UserEntity';
import { useSharedSelector } from '@shared/hooks/useSharedDispatch';
import { useSharedDispatch } from '@shared/hooks/useSharedSelector';
import {
    authenticateAction,
    authenticateCheckAction,
    registerAction,
    revokeAuthAction,
} from '@shared/redux/slices/authenticationSlice';

import { SignUpRequestDto } from '../dto/SignUpRequestDto';

export function useAuth() {
    const dispatch = useSharedDispatch();
    const accessToken = useSharedSelector((state) => state.authentication.accessToken);
    const user = useSharedSelector((state) => state.authentication.user);
    const authenticated = useSharedSelector((state) => state.authentication.authenticated);
    const checking = useSharedSelector((state) => state.authentication.checking);

    const user$ = useMemo(() => plainToClass(UserEntity, user), [user && objectHash(user)]);

    const login = useCallback(
        (email: string, password: string) => dispatch(authenticateAction({ email, password })),
        [dispatch],
    );
    const register = useCallback((input: SignUpRequestDto) => dispatch(registerAction(input)), [dispatch]);
    const authCheck = useCallback(() => dispatch(authenticateCheckAction()), [dispatch]);
    const logout = useCallback(() => dispatch(revokeAuthAction()), [dispatch]);

    return {
        user: user$,
        authCheck,
        login,
        register,
        logout,
        accessToken,
        authenticated,
        checking,
        dispatch,
    };
}

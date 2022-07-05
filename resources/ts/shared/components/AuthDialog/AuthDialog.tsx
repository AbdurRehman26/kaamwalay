import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import * as queryString from 'qs';
import { useCallback, useMemo, useState } from 'react';
import { ApplicationEventsEnum } from '../../constants/ApplicationEventsEnum';
import { AuthenticatedUserEntity } from '../../entities/AuthenticatedUserEntity';
import { useInjectable } from '../../hooks/useInjectable';
import { useSharedDispatch } from '../../hooks/useSharedDispatch';
import { googleTagManager } from '../../lib/utils/googleTagManager';
import { authenticateCheckAction } from '../../redux/slices/authenticationSlice';
import { AuthenticationService } from '../../services/AuthenticationService';
import { EventService } from '../../services/EventService';
import { NotificationsService } from '../../services/NotificationsService';
import { AuthDialogHeader } from './AuthDialogHeader';
import { AuthDialogView } from './AuthDialogView';
import { SignInContent } from './SignInContent';
import { SignUpContent } from './SignUpContent';

interface AuthDialogProps extends DialogProps {
    title?: string;
    subtitle?: string;
    internalCloseOnly?: boolean;
    initialView?: AuthDialogView;
    redirectPath?: string;
    onAuthSuccess?: (authenticatedUser: AuthenticatedUserEntity) => void;
}

const Root = styled(Dialog)({
    '.MuiDialog-paper': {
        width: 440,
        borderRadius: 8,
    },
    '.MuiDialogContent-root': {
        padding: 0,
    },
});

export function AuthDialog({
    title,
    subtitle = 'to Access Robograding',
    internalCloseOnly,
    onClose,
    initialView,
    redirectPath,
    onAuthSuccess,
    ...rest
}: AuthDialogProps) {
    const eventService = useInjectable(EventService);
    const authenticationService = useInjectable(AuthenticationService);
    const dispatch = useSharedDispatch();
    const { from: intendedRoute } = useMemo(() => {
        return queryString.parse(window.location.search.slice(1));
    }, []);

    const [view, setView] = useState(() => initialView ?? AuthDialogView.SignIn);
    const ContentComponent = useMemo(() => {
        switch (view) {
            case AuthDialogView.SignUp:
                return SignUpContent;
            default:
                return SignInContent;
        }
    }, [view]);

    const handleClose = useCallback(
        (event, reason) => {
            if (onClose && !internalCloseOnly) {
                onClose(event, reason);
            }
        },
        [internalCloseOnly, onClose],
    );

    const handleAuthSuccess = useCallback(
        async function (authenticatedUser: AuthenticatedUserEntity) {
            eventService.emit(ApplicationEventsEnum.AuthSessionLogin, authenticatedUser);
            await authenticationService.setAccessToken(authenticatedUser.accessToken);
            googleTagManager({ event: 'google-ads-authenticated' });
            dispatch(authenticateCheckAction());
            NotificationsService.success('Login successfully!');
            if (intendedRoute) {
                window.location.href = intendedRoute.toString();
            }
            if (onAuthSuccess) {
                await onAuthSuccess(authenticatedUser);
            }

            onClose && onClose({}, 'escapeKeyDown');
        },
        [authenticationService, dispatch, eventService, onAuthSuccess, onClose, intendedRoute],
    );

    return (
        <Root onClose={handleClose} disableEscapeKeyDown={internalCloseOnly} {...rest}>
            <AuthDialogHeader
                subtitle={subtitle}
                title={title ?? `${view === AuthDialogView.SignIn ? 'Log in' : 'Sign up'} to AGS`}
                onClose={onClose}
                hasClose={onClose && !internalCloseOnly}
            />
            <DialogContent>
                <ContentComponent onAuthSuccess={handleAuthSuccess} onViewChange={setView} />
            </DialogContent>
        </Root>
    );
}

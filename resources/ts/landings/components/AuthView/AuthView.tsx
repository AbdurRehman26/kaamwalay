import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as queryString from 'qs';
import { useCallback, useMemo } from 'react';
import AuthHeaderLogo from '@shared/assets/authModalIcon.svg';
import { SignUpContent } from '@shared/components/AuthDialog/SignUpContent';
import { ApplicationEventsEnum } from '@shared/constants/ApplicationEventsEnum';
import { AuthenticatedUserEntity } from '@shared/entities/AuthenticatedUserEntity';
import { useAuth } from '@shared/hooks/useAuth';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { authenticateCheckAction } from '@shared/redux/slices/authenticationSlice';
import { AuthenticationService } from '@shared/services/AuthenticationService';
import { EventService } from '@shared/services/EventService';
import { NotificationsService } from '@shared/services/NotificationsService';

interface AuthViewProps {
    redirectPath?: string;
    onAuthSuccess?: (authenticatedUser: AuthenticatedUserEntity) => void;
    content?: string;
    discount?: number;
}

const Root = styled('div')({
    '.MuiDialog-paper': {
        width: 440,
        borderRadius: 8,
    },
    '.MuiDialogContent-root': {
        padding: 0,
    },
});

const Header = styled('div')(({ theme }) => ({
    position: 'relative',
    '.AuthViewHeader-header': {
        background: 'linear-gradient(to right bottom, #140078, #6c31bc)',
        borderTopLeftRadius: '22px',
        borderTopRightRadius: '22px',
        padding: theme.spacing(2.5, 2, 6),
    },
    '.AuthViewHeader-headerLogo': {
        position: 'absolute',
        left: '50%',
        bottom: 0,
        transform: 'translate(-50%, 50%)',
    },
}));

export function AuthView({
    redirectPath = '/dashboard/referee-coupon-code',
    onAuthSuccess,
    content,
    discount,
}: AuthViewProps) {
    const eventService = useInjectable(EventService);
    const authenticationService = useInjectable(AuthenticationService);
    const dispatch = useSharedDispatch();
    const { authenticated } = useAuth();

    const { from: intendedRoute } = useMemo(() => {
        return queryString.parse(window.location.search.slice(1));
    }, []);

    const handleAuthSuccess = useCallback(
        async function (authenticatedUser: AuthenticatedUserEntity) {
            eventService.emit(ApplicationEventsEnum.AuthSessionLogin, authenticatedUser);
            await authenticationService.setAccessToken(authenticatedUser.accessToken);
            googleTagManager({ event: 'google-ads-authenticated' });
            dispatch(authenticateCheckAction());
            NotificationsService.success('Login successfully!');
            if (onAuthSuccess) {
                await onAuthSuccess(authenticatedUser);
            }

            if (redirectPath) {
                window.location.href = redirectPath;
            }
            if (intendedRoute) {
                window.location.href = intendedRoute.toString();
            }
        },
        [authenticationService, dispatch, eventService, onAuthSuccess, intendedRoute, redirectPath],
    );

    return (
        <Root>
            <Header>
                <div className={'AuthViewHeader-header'}>
                    <Grid container direction={'column'} alignItems={'center'} justifyContent={'center'} px={2}>
                        <Typography variant={'h5'} color={'white'} fontWeight={900} align={'center'}>
                            Sign up to AGS
                        </Typography>
                        <Typography variant={'body2'} color={'white'} align={'center'}>
                            to claim your {discount}% discount.
                        </Typography>
                    </Grid>
                </div>
                <div className="AuthViewHeader-headerLogo">
                    <img src={AuthHeaderLogo} alt="Robograding" />
                </div>
            </Header>
            <SignUpContent
                referralCode={content}
                onAuthSuccess={handleAuthSuccess}
                onViewChange={() => {}}
                fromReferralHome={true}
                isDisabled={authenticated}
            />
        </Root>
    );
}

export default AuthView;

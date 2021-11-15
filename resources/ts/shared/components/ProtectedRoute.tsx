import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { castArray } from 'lodash';
import { useMemo } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { AuthenticationEnum } from '../constants/AuthenticationEnum';
import { RolesEnum } from '../constants/RolesEnum';
import { useAuth } from '../hooks/useAuth';
import { NativeRedirect } from './NativeRedirect';

interface ProtectedRouteProps extends RouteProps {
    redirectRoute?: string;
    roles?: RolesEnum | RolesEnum[];
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ProtectedRoute
 * @date: 09.08.2021
 * @time: 05:46
 */
export function ProtectedRoute({ redirectRoute, roles, ...rest }: ProtectedRouteProps) {
    const { user, authenticated, checking } = useAuth();

    const hasAtLeastOneRole = useMemo(() => {
        if (user && roles) {
            return castArray<RolesEnum>(roles).filter((role) => user.hasRole(role)).length > 0;
        }

        return false;
    }, [user, roles]);

    if (checking) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { component, render, children, ...partial } = rest;
        return (
            <Route {...partial}>
                <Box padding={10} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                    <CircularProgress />
                </Box>
            </Route>
        );
    }

    if (!authenticated || (roles && !hasAtLeastOneRole)) {
        let link = redirectRoute ?? AuthenticationEnum.SignInRoute;
        if (!link.startsWith('http') && !link.startsWith('//')) {
            link = `${window.location.protocol}//${window.location.host}/${link.replace(/^\//, '')}`;
        }

        const url = new URL(link);
        url.searchParams.set('from', window.location.href);

        return <NativeRedirect to={url.href} />;
    }

    return <Route {...rest} />;
}

export default ProtectedRoute;

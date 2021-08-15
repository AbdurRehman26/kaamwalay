import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';

import { AuthenticationEnum } from '@shared/constants/AuthenticationEnum';
import { useAuth } from '@shared/hooks/useAuth';

interface GuestOnlyRouteProps extends RouteProps {
    redirectRoute?: string;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: GuestOnlyRoute
 * @date: 09.08.2021
 * @time: 05:46
 */
export function GuestOnlyRoute({ redirectRoute, ...rest }: GuestOnlyRouteProps) {
    const { authenticated, checking } = useAuth();

    useEffect(() => {
        if (authenticated && !checking) {
            window.location.replace(redirectRoute ?? AuthenticationEnum.DashboardRoute);
        }
    }, [authenticated, checking, redirectRoute]);

    if (checking) {
        const { component, render, children, ...partial } = rest;
        return (
            <Route {...partial}>
                <Box padding={10} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            </Route>
        );
    }

    if (authenticated) {
        return null;
    }

    return <Route {...rest} />;
}

export default GuestOnlyRoute;

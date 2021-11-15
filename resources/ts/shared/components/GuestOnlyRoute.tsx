import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { AuthenticationEnum } from '../constants/AuthenticationEnum';
import { useAuth } from '../hooks/useAuth';

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
            let link = redirectRoute ?? AuthenticationEnum.DashboardRoute;
            const url = new URL(window.location.href);

            if (url.searchParams.has('from')) {
                link = url.searchParams.get('from') || link;
            }

            window.location.replace(link);
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

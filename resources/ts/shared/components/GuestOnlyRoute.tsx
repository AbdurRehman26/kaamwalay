import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { AuthenticationEnum } from '../constants/AuthenticationEnum';
import { useAuth } from '../hooks/useAuth';

interface GuestOnlyRouteProps {
    redirectRoute?: string;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: GuestOnlyRoute
 * @date: 09.08.2021
 * @time: 05:46
 */
export function GuestOnlyRoute(Component: React.ElementType, { redirectRoute }: GuestOnlyRouteProps = {}) {
    function Wrapper() {
        const { authenticated, checking, user } = useAuth();

        useEffect(() => {
            if (authenticated && !checking) {
                let link =
                    redirectRoute ??
                    (user.hasRole(RolesEnum.Salesman)
                        ? AuthenticationEnum.SalesRepDashboardRoute
                        : AuthenticationEnum.DashboardRoute);
                const url = new URL(window.location.href);

                if (url.searchParams.has('from')) {
                    link = url.searchParams.get('from') || link;
                }

                window.location.replace(link);
            }
        }, [authenticated, checking, user]);

        if (checking) {
            return (
                <Box padding={10} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            );
        }

        if (authenticated) {
            return null;
        }

        return <Component />;
    }

    return <Wrapper />;
}

export default GuestOnlyRoute;

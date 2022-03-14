import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { castArray } from 'lodash';
import { ElementType, useMemo } from 'react';
import { AuthenticationEnum } from '../constants/AuthenticationEnum';
import { RolesEnum } from '../constants/RolesEnum';
import { useAuth } from '../hooks/useAuth';
import { NativeRedirect } from './NativeRedirect';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
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
export function ProtectedRoute(Component: ElementType, { redirectRoute, roles }: ProtectedRouteProps = {}) {
    function Wrapper() {
        const { user, authenticated, checking } = useAuth();
        const { search } = useLocation();

        const hasAtLeastOneRole = useMemo(() => {
            if (user && roles) {
                return castArray<RolesEnum>(roles).filter((role) => user.hasRole(role)).length > 0;
            }

            return false;
        }, [user]);

        if (checking) {
            return (
                <Box padding={10} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                    <CircularProgress />
                </Box>
            );
        }

        if (!authenticated || (roles && !hasAtLeastOneRole)) {
            let link = redirectRoute ?? AuthenticationEnum.HomeRoute;
            if (!link.startsWith('http') && !link.startsWith('//')) {
                link = `${window.location.protocol}//${window.location.host}/${link.replace(/^\//, '')}`;
            }

            const url = new URL(link);
            const params: any = new URLSearchParams(search);

            url.searchParams.set('from', window.location.href);

            if (params?.get('rfsn')) {
                url.searchParams.set('rfsn', params?.get('rfsn'));
            }

            return <NativeRedirect to={url.href} />;
        }

        return <Component />;
    }

    return <Wrapper />;
}

export default ProtectedRoute;

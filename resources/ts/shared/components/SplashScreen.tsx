import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { PropsWithChildren } from 'react';

import { useSharedSelector } from '../hooks/useSharedDispatch';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: SplashScreen
 * @date: 14.08.2021
 * @time: 02:49
 */
export function SplashScreen({ children }: PropsWithChildren<any>) {
    const isConfigLoading = useSharedSelector((state) => state.configuration.isLoading);

    if (isConfigLoading) {
        return (
            <Box minHeight={'100vh'} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
}

export default SplashScreen;

import Box, { BoxProps } from '@material-ui/core/Box';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import React, { ElementType, PropsWithChildren, ReactElement } from 'react';
import { renderElementType } from '@shared/lib/react/renderElementType';
import { useSharedSelector } from '../hooks/useSharedDispatch';

export interface SplashScreenProps extends BoxProps {
    circularProgressProps?: CircularProgressProps;
    customLoader?: ElementType | ReactElement | null;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: SplashScreen
 * @date: 14.08.2021
 * @time: 02:49
 */
export function SplashScreen({
    children,
    circularProgressProps,
    customLoader,
    ...rest
}: PropsWithChildren<SplashScreenProps>) {
    const isConfigLoading = useSharedSelector((state) => state.configuration.isLoading);

    if (isConfigLoading) {
        return customLoader ? (
            renderElementType(customLoader)
        ) : (
            <Box
                minHeight={'100vh'}
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                {...rest}
            >
                <CircularProgress {...circularProgressProps} />
            </Box>
        );
    }

    return <>{children}</>;
}

export default SplashScreen;

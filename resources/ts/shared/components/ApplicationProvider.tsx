import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { EnhancedStore } from '@reduxjs/toolkit';
import React, { PropsWithChildren, useMemo } from 'react';
import { Provider } from 'react-redux';
import AuthenticationCheck from '@shared/components/AuthenticationCheck';
import { NotificationsContainer } from '@shared/components/NotificationsContainer';
import { ConfirmationDialogProvider } from '@shared/contexts/ConfirmationDialogContext';
import { materialUiTheme } from '@shared/styles/theme';
import { ConfigurationLoad } from './ConfigurationLoad';
import { SplashScreen, SplashScreenProps } from './SplashScreen';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

interface ApplicationProviderProps {
    store: EnhancedStore;
    noSplashScreen?: boolean;
    splashScreenProps?: SplashScreenProps;
    noConfigurationLoad?: boolean;
    noAuthenticationCheck?: boolean;
    noNotificationsContainer?: boolean;
    noCssBaseline?: boolean;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: ApplicationProvider
 * @date: 09.08.2021
 * @time: 06:23
 */
export function ApplicationProvider({
    children,
    store,
    noSplashScreen,
    splashScreenProps,
    noConfigurationLoad,
    noAuthenticationCheck,
    noNotificationsContainer,
    noCssBaseline,
}: PropsWithChildren<ApplicationProviderProps>) {
    const content = useMemo(
        () => (!noSplashScreen ? <SplashScreen {...splashScreenProps}>{children}</SplashScreen> : children),
        [children, noSplashScreen, splashScreenProps],
    );

    return (
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={materialUiTheme}>
                    <>
                        {!noConfigurationLoad && <ConfigurationLoad />}
                        {!noAuthenticationCheck && <AuthenticationCheck />}
                        {!noNotificationsContainer && <NotificationsContainer />}
                        {!noCssBaseline && <CssBaseline />}
                        <ConfirmationDialogProvider>{content}</ConfirmationDialogProvider>
                    </>
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    );
}

export default ApplicationProvider;

import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import { EnhancedStore } from '@reduxjs/toolkit';
import React, { PropsWithChildren, useMemo } from 'react';
import { Provider } from 'react-redux';
import { ConfirmationDialogProvider } from '../contexts/ConfirmationDialogContext';
import { materialUiTheme } from '../styles/theme';
import AuthenticationCheck from './AuthenticationCheck';
import { ConfigurationLoad } from './ConfigurationLoad';
import { NotificationsContainer } from './NotificationsContainer';
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
export function ApplicationProvider(props: PropsWithChildren<ApplicationProviderProps>) {
    const {
        children,
        store,
        noSplashScreen,
        splashScreenProps,
        noConfigurationLoad,
        noAuthenticationCheck,
        noNotificationsContainer,
        noCssBaseline,
    } = props;

    const content = useMemo(
        () => (!noSplashScreen ? <SplashScreen {...splashScreenProps}>{children}</SplashScreen> : children),
        [children, noSplashScreen, splashScreenProps],
    );

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
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
        </LocalizationProvider>
    );
}

export default ApplicationProvider;

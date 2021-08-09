import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { EnhancedStore } from '@reduxjs/toolkit';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import AuthenticationCheck from '@shared/components/AuthenticationCheck';
import { NotificationsContainer } from '@shared/components/NotificationsContainer';
import { ConfirmationDialogProvider } from '@shared/contexts/ConfirmationDialogContext';
import { materialUiTheme } from '@shared/styles/theme';

interface ApplicationProviderProps {
    store: EnhancedStore;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: ApplicationProvider
 * @date: 09.08.2021
 * @time: 06:23
 */
export function ApplicationProvider({ children, store }: PropsWithChildren<ApplicationProviderProps>) {
    return (
        <Provider store={store}>
            <ThemeProvider theme={materialUiTheme}>
                <>
                    <AuthenticationCheck />
                    <NotificationsContainer />
                    <CssBaseline />
                    <ConfirmationDialogProvider>{children}</ConfirmationDialogProvider>
                </>
            </ThemeProvider>
        </Provider>
    );
}

export default ApplicationProvider;

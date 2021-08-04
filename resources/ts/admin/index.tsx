import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'reflect-metadata';

import App from './App';
import './index.scss';
import { store } from './redux/store';
import theme from './theming';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <>
                    <CssBaseline />
                    <App />
                </>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

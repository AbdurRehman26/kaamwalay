import '@publicPath';
import React from 'react';
import ReactDOM from 'react-dom';
import 'reflect-metadata';

import { ApplicationProvider } from '@shared/components/ApplicationProvider';

import App from './App';
import { store } from './redux/store';

ReactDOM.render(
    <React.StrictMode>
        <ApplicationProvider store={store}>
            <App />
        </ApplicationProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
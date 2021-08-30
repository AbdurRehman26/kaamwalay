import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GoogleAnalyticsSetup } from '@shared/components/GoogleAnalyticsSetup';
import { Auth } from './Auth';

function App() {
    return (
        <BrowserRouter basename={'/auth'}>
            <GoogleAnalyticsSetup />
            <Switch>
                <Route path={'/'} component={Auth} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;

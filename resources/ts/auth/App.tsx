import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ConfigureGA } from '@shared/components/GoogleAnalyticsWrapper';
import { Auth } from './Auth';

function App() {
    return (
        <BrowserRouter basename={'/auth'}>
            <ConfigureGA />
            <Switch>
                <Route path={'/'} component={Auth} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GAWrapper } from '@shared/components/GoogleAnalyticsWrapper';
import { Auth } from './Auth';

function App() {
    return (
        <BrowserRouter basename={'/auth'}>
            <GAWrapper basename={'/auth'}>
                <Switch>
                    <Route path={'/'} component={Auth} />
                </Switch>
            </GAWrapper>
        </BrowserRouter>
    );
}

export default App;

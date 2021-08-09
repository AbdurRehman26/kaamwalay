import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Auth } from '@auth/pages';

function App() {
    return (
        <BrowserRouter basename={'/auth'}>
            <Switch>
                <Route path={'/'} component={Auth} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;

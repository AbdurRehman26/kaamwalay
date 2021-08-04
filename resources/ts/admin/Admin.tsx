import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Main } from './pages/Main';

export function Admin() {
    return (
        <Switch>
            <Route exact path={'/'} component={Main} />
        </Switch>
    );
}

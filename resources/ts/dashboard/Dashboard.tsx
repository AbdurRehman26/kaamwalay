import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Submissions } from './pages/Submissions';

export function Dashboard() {
    return (
        <Switch>
            <Route path={'/submissions'} component={Submissions} />
        </Switch>
    );
}

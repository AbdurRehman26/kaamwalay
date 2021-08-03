import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Submissions } from './pages/Submissions';

export function Dashboard() {
    return (
        <Switch>
            <Redirect exact from="/" to="/submissions" />
            <Route path={'/submissions'} component={Submissions} />
        </Switch>
    );
}

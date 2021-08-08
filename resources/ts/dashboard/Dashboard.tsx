import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import SignUpPage from '@dashboard/pages/Signup';

import { Submissions } from './pages/Submissions';

export function Dashboard() {
    return (
        <Switch>
            <Redirect exact from="/" to="/submissions" />
            <Route exact path={'/signup'} component={SignUpPage} />
            <Route path={'/submissions'} component={Submissions} />
        </Switch>
    );
}

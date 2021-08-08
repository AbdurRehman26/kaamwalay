import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import SignInPage from '@dashboard/pages/SignInPage';
import SignUpPage from '@dashboard/pages/Signup';

import { Submissions } from './pages/Submissions';

export function Dashboard() {
    return (
        <Switch>
            <Redirect exact from="/" to="/submissions" />
            <Route exact path={'/signup'} component={SignUpPage} />
            <Route exact path={'/signin'} component={SignInPage} />
            <Route path={'/submissions'} component={Submissions} />
        </Switch>
    );
}

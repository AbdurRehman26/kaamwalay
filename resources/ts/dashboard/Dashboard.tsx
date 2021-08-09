import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import ProtectedRoute from '@dashboard/components/ProtectedRoute';

import { Submissions } from './pages/Submissions';

export function Dashboard() {
    return (
        <Switch>
            <Redirect exact from="/" to="/submissions" />
            <ProtectedRoute path={'/submissions'} component={Submissions} />
        </Switch>
    );
}

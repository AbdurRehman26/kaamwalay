import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import { ProtectedRoute } from '@shared/components/ProtectedRoute';

import { Cards } from './pages/Cards/Cards';
import { Submissions } from './pages/Submissions';

export function Dashboard() {
    return (
        <Switch>
            <Redirect exact from="/" to="/submissions" />
            <ProtectedRoute path={'/submissions'} component={Submissions} />
            <ProtectedRoute path={'/cards'} component={Cards} />
        </Switch>
    );
}

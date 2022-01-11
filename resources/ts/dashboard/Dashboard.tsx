import React from 'react';
import { Redirect, Switch, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { Cards } from './pages/Cards/Cards';
import { Submissions } from './pages/Submissions';
import { Profile } from './pages/Profile';

export function Dashboard() {
    const { search } = useLocation();
    const params: any = new URLSearchParams(search);

    let redirectSubmissionRoute = '/submissions';
    if (params?.get('rfsn')) {
        redirectSubmissionRoute =
            redirectSubmissionRoute + '?rfsn=' + params?.get('rfsn') + '&rf_test=' + params?.get('rf_test');
    }
    return (
        <Switch>
            <Redirect exact from="/" push to={redirectSubmissionRoute} />
            <ProtectedRoute path={'/submissions'} component={Submissions} />
            <ProtectedRoute path={'/cards'} component={Cards} />
            <ProtectedRoute path={'/profile'} component={Profile} />
        </Switch>
    );
}

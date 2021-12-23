import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Submissions } from './pages/Submissions';
import { Customers } from './pages/Customers';

export function Admin() {
    return (
        <Layout>
            <Switch>
                <Redirect exact from={'/'} to={'/submissions'} />
                <Route path={'/submissions'} component={Submissions} />
                <Route path={'/customers'} component={Customers} />
            </Switch>
        </Layout>
    );
}

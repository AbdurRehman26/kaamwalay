import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Submissions } from './pages/Submissions';
import { PromoCodes } from '@admin/pages/PromoCodes';

export function Admin() {
    return (
        <Layout>
            <Switch>
                <Redirect exact from={'/'} to={'/submissions'} />
                <Route path={'/submissions'} component={Submissions} />
                <Route path={'/promo-codes'} component={PromoCodes} />
            </Switch>
        </Layout>
    );
}

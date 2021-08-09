import axios from 'axios';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { LayoutOptions } from '@dashboard/components/Layout/LayoutOptions';

import { Dashboard } from './Dashboard';
import { Layout } from './components/Layout';

const RoutesOptions = {
    '/submissions/new': LayoutOptions.empty(),
    '/signup': LayoutOptions.empty(),
    '/signin': LayoutOptions.empty(),
    '/submissions/:id/confirmation': LayoutOptions.build().withoutSidebar(),
};

function App() {
    const userToken = localStorage.getItem('userAuthData')
        ? JSON.parse(localStorage.getItem('userAuthData')!).token
        : '';
    axios.defaults.headers.common = {
        Authorization: 'Bearer ' + userToken,
        Accept: 'application/json',
    };

    return (
        <BrowserRouter basename={'/dashboard'}>
            <Layout routeOptions={RoutesOptions}>
                <Switch>
                    <Route path={'/'} component={Dashboard} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default App;

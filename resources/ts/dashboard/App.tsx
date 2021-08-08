import axios from 'axios';
import React from 'react';
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

const userToken = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!).authToken : '';
axios.defaults.headers.common = {
    Authorization: 'Bearer ' + userToken,
    Accept: 'application/json',
};

function App() {
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

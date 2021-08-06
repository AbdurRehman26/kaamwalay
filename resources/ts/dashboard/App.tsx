import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { LayoutOptions } from '@dashboard/components/Layout/LayoutOptions';

import { Dashboard } from './Dashboard';
import { Layout } from './components/Layout';

const PlainLayoutOnRoutes = {
    '/submissions/new': LayoutOptions.empty(),
    '/submissions/:id/confirmation': LayoutOptions.build().withoutSidebar(),
};

function App() {
    return (
        <BrowserRouter basename={'/dashboard'}>
            <Layout routeOptions={PlainLayoutOnRoutes}>
                <Switch>
                    <Route path={'/'} component={Dashboard} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default App;

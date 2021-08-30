import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ConfigureGA } from '@dashboard/../shared/components/GoogleAnalyticsWrapper';
import { LayoutOptions } from '@dashboard/components/Layout/LayoutOptions';
import { Dashboard } from './Dashboard';
import { Layout } from './components/Layout';

const RoutesOptions = {
    '/submissions/new': LayoutOptions.empty(),
    '/submissions/:id/confirmation': LayoutOptions.build().withoutSidebar(),
};

function App() {
    return (
        <BrowserRouter basename={'/dashboard'}>
            <ConfigureGA />
            <Layout routeOptions={RoutesOptions}>
                <Switch>
                    <Route path={'/'} component={Dashboard} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default App;

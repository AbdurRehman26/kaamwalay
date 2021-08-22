import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GAWrapper } from '@dashboard/components/GoogleAnalyticsWrapper';
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
            <GAWrapper>
                <Layout routeOptions={RoutesOptions}>
                    <Switch>
                        <Route path={'/'} component={Dashboard} />
                    </Switch>
                </Layout>
            </GAWrapper>
        </BrowserRouter>
    );
}

export default App;

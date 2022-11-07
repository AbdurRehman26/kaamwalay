import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { GoogleAnalyticsSetup } from '@dashboard/../shared/components/GoogleAnalyticsSetup';
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
            <GoogleAnalyticsSetup />
            <Layout routeOptions={RoutesOptions}>
                <Routes>
                    <Route path={'/*'} element={ProtectedRoute(Dashboard, { roles: RolesEnum.Customer })} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;

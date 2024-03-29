import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { Layout } from '@dashboard/components/Layout';
import { LayoutOptions } from '@dashboard/components/Layout/LayoutOptions';
import { Wallet } from '@dashboard/pages/Wallet';
import { ListAddresses } from './pages/Addresses';
import { Cards } from './pages/Cards/Cards';
import { PaymentCards } from './pages/PaymentCards';
import { Profile } from './pages/Profile';
import { ReferralProgram } from './pages/Referral';
import { Submissions } from './pages/Submissions';
import { VaultShipments } from './pages/VaultShipments';

const RoutesOptions = {
    '/submissions/new': LayoutOptions.empty(),
    '/submissions/:id/confirmation': LayoutOptions.build().withoutSidebar(),
    '/referee-coupon-code': LayoutOptions.build().withoutHeader().withoutSidebar(),
};

export function Dashboard() {
    const { search } = useLocation();
    const params: any = new URLSearchParams(search);

    let redirectSubmissionRoute = '/submissions';
    if (params?.get('rfsn')) {
        redirectSubmissionRoute = redirectSubmissionRoute + '?rfsn=' + params?.get('rfsn');
    }
    return (
        <Layout routeOptions={RoutesOptions}>
            <Routes>
                <Route path={'/'} element={<Navigate to={redirectSubmissionRoute} replace />} />
                <Route path={'/submissions/*'} element={<Submissions />} />
                <Route path={'/vault-shipments/*'} element={<VaultShipments />} />
                <Route path={'/cards/*'} element={ProtectedRoute(Cards)} />
                <Route path={'/profile/*'} element={ProtectedRoute(Profile)} />
                <Route path={'/wallet/*'} element={ProtectedRoute(Wallet)} />
                <Route path={'/payment-cards/*'} element={ProtectedRoute(PaymentCards)} />
                <Route path={'/address-book/*'} element={ProtectedRoute(ListAddresses)} />
                <Route path={'/referral-program/*'} element={ProtectedRoute(ReferralProgram)} />
            </Routes>
        </Layout>
    );
}

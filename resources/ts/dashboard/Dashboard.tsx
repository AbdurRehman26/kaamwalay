import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { Wallet } from '@dashboard/pages/Wallet';
import { Cards } from './pages/Cards/Cards';
import { Profile } from './pages/Profile';
import { Submissions } from './pages/Submissions';
import { VaultShipments } from './pages/VaultShipments';

export function Dashboard() {
    const { search } = useLocation();
    const params: any = new URLSearchParams(search);

    let redirectSubmissionRoute = '/submissions';
    if (params?.get('rfsn')) {
        redirectSubmissionRoute = redirectSubmissionRoute + '?rfsn=' + params?.get('rfsn');
    }
    return (
        <Routes>
            <Route path={'/'} element={<Navigate to={redirectSubmissionRoute} replace />} />
            <Route path={'/submissions/*'} element={<Submissions />} />
            <Route path={'/vault-shipments/*'} element={<VaultShipments />} />
            <Route path={'/cards/*'} element={ProtectedRoute(Cards)} />
            <Route path={'/profile/*'} element={ProtectedRoute(Profile)} />
            <Route path={'/wallet/*'} element={ProtectedRoute(Wallet)} />
        </Routes>
    );
}

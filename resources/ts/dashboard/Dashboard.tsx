import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { Cards } from './pages/Cards/Cards';
import { Submissions } from './pages/Submissions';
import { Profile } from './pages/Profile';
import { Wallet } from '@dashboard/pages/Wallet';

export function Dashboard() {
    return (
        <Routes>
            <Route path={'/'} element={<Navigate to="/submissions" replace />} />
            <Route path={'/submissions/*'} element={ProtectedRoute(Submissions)} />
            <Route path={'/cards/*'} element={ProtectedRoute(Cards)} />
            <Route path={'/profile/*'} element={ProtectedRoute(Profile)} />
            <Route path={'/wallet/*'} element={ProtectedRoute(Wallet)} />
        </Routes>
    );
}

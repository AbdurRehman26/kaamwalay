import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ReferralProgram } from '@admin/pages/ReferralProgram';
import { Layout } from './components/Layout';
import { AbandonedSubmissions } from './pages/AbandonedSubmissions';
import { Cards } from './pages/Cards';
import { Customers } from './pages/Customers';
import { PromoCodes } from './pages/PromoCodes';
import { Rarities } from './pages/Rarities';
import { SalesReps } from './pages/SalesReps';
import { Submissions } from './pages/Submissions';
import { Surfaces } from './pages/Surfaces';
import { VaultShipment } from './pages/VaultShipment';

export function Admin() {
    return (
        <Layout>
            <Routes>
                <Route path={''} element={<Navigate to={'/submissions'} replace />} />
                <Route path={'/submissions/*'} element={<Submissions />} />
                <Route path={'/abandoned/submissions/*'} element={<AbandonedSubmissions />} />
                <Route path={'/promo-codes/*'} element={<PromoCodes />} />
                <Route path={'/customers/*'} element={<Customers />} />
                <Route path={'/salesreps/*'} element={<SalesReps />} />
                <Route path={'/vault-storage/*'} element={<VaultShipment />} />
                <Route path={'/cards/*'} element={<Cards />} />
                <Route path={'/rarities/*'} element={<Rarities />} />
                <Route path={'/surfaces/*'} element={<Surfaces />} />
                <Route path={'/referral-program/*'} element={<ReferralProgram />} />
            </Routes>
        </Layout>
    );
}

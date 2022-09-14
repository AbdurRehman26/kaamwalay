import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Cards } from './pages/Cards';
import { Customers } from './pages/Customers';
import { PromoCodes } from './pages/PromoCodes';
import { Submissions } from './pages/Submissions';
import { VaultShipment } from './pages/VaultShipment';

export function Admin() {
    return (
        <Layout>
            <Routes>
                <Route path={''} element={<Navigate to={'/submissions'} replace />} />
                <Route path={'/submissions/*'} element={<Submissions />} />
                <Route path={'/promo-codes/*'} element={<PromoCodes />} />
                <Route path={'/customers/*'} element={<Customers />} />
                <Route path={'/vault-storage/*'} element={<VaultShipment />} />
                <Route path={'/cards/*'} element={<Cards />} />
            </Routes>
        </Layout>
    );
}

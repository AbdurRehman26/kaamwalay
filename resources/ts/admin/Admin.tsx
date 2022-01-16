import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Submissions } from './pages/Submissions';
import { PromoCodes } from './pages/PromoCodes';
import { Customers } from './pages/Customers';

export function Admin() {
    return (
        <Layout>
            <Routes>
                <Route path={''} element={<Navigate to={'/submissions'} replace />} />
                <Route path={'/submissions/*'} element={<Submissions />} />
                <Route path={'/promo-codes/*'} element={<PromoCodes />} />
                <Route path={'/customers/*'} element={<Customers />} />
            </Routes>
        </Layout>
    );
}

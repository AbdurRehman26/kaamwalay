import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Customers } from './pages/Customers';
import { SalesRep as SalesRepDashboard } from './pages/SalesRep';
import { Submissions } from './pages/Submissions';

export function SalesRep() {
    return (
        <Layout>
            <Routes>
                <Route path={'/'} element={<Navigate to={'/dashboard'} replace />} />
                <Route path={'/dashboard/*'} element={<SalesRepDashboard />} />
                <Route path={'/submissions/*'} element={<Submissions />} />
                <Route path={'/customers/*'} element={<Customers />} />
            </Routes>
        </Layout>
    );
}

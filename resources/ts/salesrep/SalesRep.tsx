import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SalesRep as SalesRepDashboard } from './pages/SalesRep';

export function SalesRep() {
    return (
        <Layout>
            <Routes>
                <Route path={'/'} element={<Navigate to={'/salesrep'} replace />} />
                <Route path={'/salesrep/*'} element={<SalesRepDashboard />} />
            </Routes>
        </Layout>
    );
}

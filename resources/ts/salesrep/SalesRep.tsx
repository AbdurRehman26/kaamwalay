import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';

export function SalesRep() {
    return (
        <Layout>
            <Routes>
                <Route path={''} element={<Navigate to={'/dashboard'} replace />} />
                <Route path={'/dashboard'} element={<Dashboard />} />
            </Routes>
        </Layout>
    );
}

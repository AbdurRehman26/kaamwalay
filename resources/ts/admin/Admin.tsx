import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Submissions } from './pages/Submissions';

export function Admin() {
    return (
        <Layout>
            <Routes>
                <Route path={''} element={<Navigate to={'/submissions'} replace />} />
                <Route path={'/submissions/*'} element={<Submissions />} />
            </Routes>
        </Layout>
    );
}

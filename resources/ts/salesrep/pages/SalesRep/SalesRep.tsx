import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SalesRepDashboard } from './SalesRepDashboard';

export function SalesRep() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/dashboard'} replace />} />
            <Route path={'/dashboard'} element={<SalesRepDashboard />} />
        </Routes>
    );
}

export default SalesRep;

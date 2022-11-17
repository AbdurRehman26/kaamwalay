import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SalesRepView } from './SalesRepView';
import { SalesRepsList } from './SalesRepsList';

export function SalesReps() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/salesreps/list'} replace />} />
            <Route path={'list'} element={<SalesRepsList />} />
            <Route path={'/:id/view/:tab'} element={<SalesRepView />} />
        </Routes>
    );
}

export default SalesReps;

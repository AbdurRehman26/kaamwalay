import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import { CollectorCoinConfirmationSubmission } from './CollectorCoinConfirmationSubmission';
import { ConfirmationSubmission } from './ConfirmationSubmission';
import { ListSubmissions } from './ListSubmissions';
import { NewSubmission } from './NewSubmission';
import { ViewSubmission } from './ViewSubmission';

export function Submissions() {
    return (
        <Routes>
            <Route path={''} element={ProtectedRoute(ListSubmissions)} />
            <Route path={'/:id/view'} element={ProtectedRoute(ViewSubmission)} />
            <Route path={'/:id/confirmation'} element={ProtectedRoute(ConfirmationSubmission)} />
            <Route
                path={'/:id/collector-coin/confirmation'}
                element={ProtectedRoute(CollectorCoinConfirmationSubmission)}
            />

            <Route path={'/new'} element={<NewSubmission />} />
        </Routes>
    );
}

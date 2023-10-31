import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import Payment from '@dashboard/pages/Submissions/Payment/Payment';
import { AffirmConfirmationSubmission } from './AffirmConfirmationSubmission';
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
            <Route path={'/:id/pay'} element={ProtectedRoute(Payment)} />
            <Route
                path={'/:id/collector-coin/confirmation'}
                element={ProtectedRoute(CollectorCoinConfirmationSubmission)}
            />
            <Route path={'/:id/affirm/confirmation'} element={ProtectedRoute(AffirmConfirmationSubmission)} />
            <Route path={'/new'} element={<NewSubmission />} />
        </Routes>
    );
}

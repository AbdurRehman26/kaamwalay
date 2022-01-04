import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ConfirmationSubmission } from './ConfirmationSubmission';
import { ListSubmissions } from './ListSubmissions';
import { NewSubmission } from './NewSubmission';
import { ViewSubmission } from './ViewSubmission';
import { CollectorCoinConfirmationSubmission } from './CollectorCoinConfirmationSubmission';

export function Submissions() {
    return (
        <Routes>
            <Route path={''} element={<ListSubmissions />} />
            <Route path={'/new'} element={<NewSubmission />} />
            <Route path={'/:id/view'} element={<ViewSubmission />} />
            <Route path={'/:id/confirmation'} element={<ConfirmationSubmission />} />
            <Route path={'/:id/collector-coin/confirmation'} element={<CollectorCoinConfirmationSubmission />} />
        </Routes>
    );
}

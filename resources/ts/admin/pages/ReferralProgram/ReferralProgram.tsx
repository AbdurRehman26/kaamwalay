import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ReferralProgramPayoutList } from './ReferralProgramPayoutList';

export function ReferralProgram() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/referral-program/pending/list'} replace />} />
            <Route path={'/:tab/list'} element={<ReferralProgramPayoutList />} />
        </Routes>
    );
}

export default ReferralProgram;

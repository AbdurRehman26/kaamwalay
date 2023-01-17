import { Navigate, Route, Routes } from 'react-router-dom';
import Referral from './Referral';

export function ReferralProgram() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/referral-program/main'} replace />} />
            <Route path={'/:tab'} element={<Referral />} />
        </Routes>
    );
}

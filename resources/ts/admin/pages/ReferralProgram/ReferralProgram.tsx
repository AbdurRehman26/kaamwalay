import { Navigate, Route, Routes } from 'react-router-dom';
import { ReferralProgramOverview } from '@admin/pages/ReferralProgram/ReferralProgramOverview';

export function ReferralProgram() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/referral-program/overview'} replace />} />
            <Route path={'/overview'} element={<ReferralProgramOverview />} />
        </Routes>
    );
}

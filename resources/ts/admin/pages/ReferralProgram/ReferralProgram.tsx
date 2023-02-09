import { Navigate, Route, Routes } from 'react-router-dom';
import { RefereesList } from '@admin/pages/ReferralProgram/RefereesList';
import { ReferralProgramOverview } from '@admin/pages/ReferralProgram/ReferralProgramOverview';

export function ReferralProgram() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/referral-program/overview'} replace />} />
            <Route path={'/overview'} element={<ReferralProgramOverview />} />
            <Route path={'/referees'} element={<RefereesList />} />
        </Routes>
    );
}

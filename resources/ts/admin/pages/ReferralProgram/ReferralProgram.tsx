import { Navigate, Route, Routes } from 'react-router-dom';
import { RefereesList } from '@admin/pages/ReferralProgram/RefereesList';
import { ReferralProgramOverview } from '@admin/pages/ReferralProgram/ReferralProgramOverview';
import { ReferrersList } from '@admin/pages/ReferralProgram/ReferrersList';
import { SubmissionsList } from '@admin/pages/ReferralProgram/SubmissionsList';

export function ReferralProgram() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/referral-program/overview'} replace />} />
            <Route path={'/overview'} element={<ReferralProgramOverview />} />
            <Route path={'/referees'} element={<RefereesList />} />
            <Route path={'/referrers'} element={<ReferrersList />} />
            <Route path={'/submissions'} element={<Navigate to={'/referral-program/submissions/all/list'} replace />} />
            <Route path={'/submissions/:tab/list'} element={<SubmissionsList />} />
        </Routes>
    );
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { CreateSubmission } from './CreateSubmission';
import { SubmissionsList } from './SubmissionsList';
import { SubmissionsView } from './SubmissionsView';

export function Submissions() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/submissions/all/list'} replace />} />
            <Route path={'/:tab/list'} element={<SubmissionsList />} />
            <Route path={'/:id/view'} element={<SubmissionsView />} />
            <Route path={'/:customerId/new'} element={<CreateSubmission />} />
        </Routes>
    );
}

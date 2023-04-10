import { Navigate, Route, Routes } from 'react-router-dom';
import { SubmissionsList } from './SubmissionsList';

export function AbandonedSubmissions() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/submissions/all/list'} replace />} />
            <Route path={'/:tab/list'} element={<SubmissionsList />} />
        </Routes>
    );
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { SubmissionsGrade } from './SubmissionsGrade';
import { SubmissionsList } from './SubmissionsList';
import { SubmissionsReview } from './SubmissionsReview';
import { SubmissionsView } from './SubmissionsView';

export function Submissions() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/submissions/all/list'} replace />} />
            <Route path={'/:tab/list'} element={<SubmissionsList />} />
            <Route path={'/:id/view'} element={<SubmissionsView />} />
            <Route path={'/:id/review'} element={<SubmissionsReview />} />
            <Route path={'/:id/grade'} element={<SubmissionsGrade />} />
        </Routes>
    );
}

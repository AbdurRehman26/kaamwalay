import { Redirect, Route, Switch } from 'react-router-dom';
import { SubmissionsGrade } from './SubmissionsGrade';
import { SubmissionsList } from './SubmissionsList';
import { SubmissionsReview } from './SubmissionsReview';
import { SubmissionsView } from './SubmissionsView';

export function Submissions() {
    return (
        <Switch>
            <Redirect exact from={'/submissions'} to={'/submissions/all/list'} />
            <Route exact path={'/submissions/:tab/list'} component={SubmissionsList} />
            <Route exact path={'/submissions/:id/view'} component={SubmissionsView} />
            <Route exact path={'/submissions/:id/review'} component={SubmissionsReview} />
            <Route exact path={'/submissions/:id/grade'} component={SubmissionsGrade} />
        </Switch>
    );
}

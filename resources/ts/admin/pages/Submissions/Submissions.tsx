import { Route, Switch } from 'react-router-dom';
import SubmissionsList from './SubmissionsList';

export function Submissions() {
    return (
        <Switch>
            <Route exact path={'/submissions'} component={SubmissionsList} />
        </Switch>
    );
}

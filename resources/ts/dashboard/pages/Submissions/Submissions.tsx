import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ListSubmissionsPage } from './ListSubmissionsPage';
import NewSubmission from './NewSubmission';

export function Submissions() {
    return (
        <Switch>
            <Route exact path={'/submissions/new'} component={NewSubmission} />
            <Route exact path={'/submissions'} component={ListSubmissionsPage} />
        </Switch>
    );
}

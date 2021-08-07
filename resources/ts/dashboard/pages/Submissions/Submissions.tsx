import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ConfirmationSubmission } from './ConfirmationSubmission';
import { ListSubmissions } from './ListSubmissions';
import { NewSubmission } from './NewSubmission';
import { ViewSubmission } from './ViewSubmission';

export function Submissions() {
    return (
        <Switch>
            <Route exact path={'/submissions/new'} component={NewSubmission} />
            <Route exact path={'/submissions'} component={ListSubmissions} />
            <Route exact path={'/submissions/:id/view'} component={ViewSubmission} />
            <Route exact path={'/submissions/:id/confirmation'} component={ConfirmationSubmission} />
        </Switch>
    );
}

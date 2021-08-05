import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import { ViewSubmissionBilling } from './ViewSubmissionBilling';
import { ViewSubmissionDetails } from './ViewSubmissionDetails';
import { ViewSubmissionHeader } from './ViewSubmissionHeader';
import { ViewSubmissionInformation } from './ViewSubmissionInformation';
import { ViewSubmissionStatus } from './ViewSubmissionStatus';
import { SubmissionSteps } from './data';

/**
 * View Submission page
 * @type Page
 * @public
 * @constructor
 */
export function ViewSubmission() {
    return (
        <Grid container direction={'column'}>
            <ViewSubmissionHeader />
            <Divider />
            <ViewSubmissionStatus currentStep={SubmissionSteps.Placed} />
            <Divider />
            <ViewSubmissionInformation />
            <Divider />
            <ViewSubmissionBilling />
            <ViewSubmissionDetails />
        </Grid>
    );
}

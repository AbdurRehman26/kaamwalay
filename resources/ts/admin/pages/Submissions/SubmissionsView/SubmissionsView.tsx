import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useParams } from 'react-router-dom';
import { SubmissionViewCards } from '@shared/components/SubmissionViewCards';
import { SubmissionsViewDetails } from './SubmissionsViewDetails';
import { SubmissionsViewHeader } from './SubmissionsViewHeader';

export function SubmissionsView() {
    const { id } = useParams<{ id: string }>();

    return (
        <Grid container direction={'column'}>
            <SubmissionsViewHeader orderId={id} />
            <Divider />
            <SubmissionsViewDetails />
            <SubmissionViewCards />
        </Grid>
    );
}

export default SubmissionsView;

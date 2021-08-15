import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import OrderReviewSection from '@dashboard/components/SubmissionOrderReview/OrderReviewSection';
import AddedSubmissionCards from './AddedSubmissionCards';
import StepDescription from './StepDescription';
import SubmissionSummary from './SubmissionSummary';

const useStyles = makeStyles({
    stepDescriptionContainer: {
        maxWidth: '425px',
    },
    leftSideContainer: {
        marginTop: '12px',
    },
    divider: {
        marginTop: '64px',
    },
    valueAlert: {
        marginTop: '16px',
    },
});

function SubmissionStep05Content() {
    const classes = useStyles();

    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title="Review your submission"
                    description={
                        <Box maxWidth={342}>
                            Go through all the information you input in the previous steps, and click submit to finish
                            submission.
                        </Box>
                    }
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        <AddedSubmissionCards reviewMode />
                        <OrderReviewSection />
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SubmissionSummary />
                </Grid>
            </Grid>

            <Divider light className={classes.divider} />
        </Container>
    );
}

export default SubmissionStep05Content;

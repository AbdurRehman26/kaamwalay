import { Container, Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import OrderReviewSection from '@dashboard/components/SubmissionOrderReview/OrderReviewSection';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setIsNextDisabled } from '../redux/slices/newSubmissionSlice';
import AddedSubmissionCards from './AddedSubmissionCards';
import CardSubmissionSearchField from './CardSubmissionSearchField';
import CardsSearchResults from './CardsSearchResults';
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
    const searchValue = useAppSelector((state) => state.newSubmission.step02Data.searchValue);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const protectionLimit = useAppSelector(
        (state) => state.newSubmission?.step01Data?.selectedServiceLevel.maxProtectionAmount,
    );
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const dispatch = useAppDispatch();

    function areSelectedCardsValuesValid() {
        if (selectedCards.length > 0) {
            // @ts-ignore
            const cardsWithValueHigherThanProtection = selectedCards.filter(
                (card: Record<string, any>) => card?.value > protectionLimit,
            );
            if (currentStep === 1) {
                cardsWithValueHigherThanProtection.length !== 0
                    ? dispatch(setIsNextDisabled(true))
                    : dispatch(setIsNextDisabled(false));
            }
            return cardsWithValueHigherThanProtection.length === 0;
        }
        return true;
    }

    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title="Review your submission"
                    description={
                        <div style={{ maxWidth: '342px' }}>
                            Go through all the information you input in the previous steps, and click submit to finish
                            submission.
                        </div>
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

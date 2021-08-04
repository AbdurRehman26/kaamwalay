import { Container, Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

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

function SubmissionStep02Content() {
    const classes = useStyles();
    const searchValue = useAppSelector((state) => state.newSubmission.step02Data.searchValue);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const protectionLimit = useAppSelector(
        (state) => state.newSubmission?.step01Data?.selectedServiceLevel.max_protection_amount,
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
                    title="Add cards to your submission"
                    description="Search for a card below and click the “+” icon, then enter the quantity and value for each card."
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        <CardSubmissionSearchField />
                        {searchValue !== '' ? <CardsSearchResults /> : null}
                        <AddedSubmissionCards />

                        {!areSelectedCardsValuesValid() ? (
                            <Alert severity="error" className={classes.valueAlert}>
                                Card's value can't be higher than the protection level.
                            </Alert>
                        ) : null}
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

export default SubmissionStep02Content;

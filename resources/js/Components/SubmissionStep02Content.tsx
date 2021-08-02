import React from 'react';
import {
    Container,
    Divider,
    Grid,
} from "@material-ui/core";
import StepDescription from "./StepDescription";
import {makeStyles} from "@material-ui/core/styles";
import {useAppDispatch, useAppSelector} from "../hooks";
import CardSubmissionSearchField from "./CardSubmissionSearchField";
import AddedSubmissionCards from "./AddedSubmissionCards";
import CardsSearchResults from "./CardsSearchResults";
import SubmissionSummary from "./SubmissionSummary";
import Alert from '@material-ui/lab/Alert';
import {setIsNextDisabled} from "../Redux/Slices/newSubmissionSlice";

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
    }
})

function SubmissionStep02Content() {
    const classes = useStyles();
    const searchValue = useAppSelector((state) => state.newSubmission.step02Data.searchValue);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const protectionLimit = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.protectionLimit)
    const currentStep = useAppSelector(state => state.newSubmission.currentStep);
    const formattedProtectionLimit = Number(protectionLimit.replace(/[^0-9\.-]+/g, ""));
    const dispatch = useAppDispatch();

    function areSelectedCardsValuesValid() {
        if (selectedCards.length > 0) {
            // @ts-ignore
            const cardsWithValueHigherThanProtection = selectedCards.filter((card) => card?.value > formattedProtectionLimit)
            if(currentStep === 1) {
                cardsWithValueHigherThanProtection.length !== 0 ? dispatch(setIsNextDisabled(true)) : dispatch(setIsNextDisabled(false))
            }
            return cardsWithValueHigherThanProtection.length === 0
        }
        return true;
    }

    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription title='Add cards to your submission'
                                 description="Search for a card below and click the “+” icon, then enter the quantity and value for each card."/>
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light/>
                    <div className={classes.leftSideContainer}>
                        <CardSubmissionSearchField/>
                        {searchValue !== '' ? <CardsSearchResults/> : null}
                        <AddedSubmissionCards/>

                        {!areSelectedCardsValuesValid() ?
                            <Alert severity="error" className={classes.valueAlert}>Card's value can't be higher than the protection level. </Alert>
                            : null}
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SubmissionSummary/>
                </Grid>
            </Grid>

            <Divider light className={classes.divider}/>
        </Container>
    )
}

export default SubmissionStep02Content;
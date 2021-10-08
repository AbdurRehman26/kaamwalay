import { useMediaQuery } from '@mui/material';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import algoliaSearch from 'algoliasearch';
import React, { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import CardsSearchMobileModal from '@dashboard/components/CardsSearchMobileModal';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { backStep, setIsNextDisabled } from '../redux/slices/newSubmissionSlice';
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
        (state) => state.newSubmission?.step01Data?.selectedServiceLevel.maxProtectionAmount,
    );
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const { appEnv, algoliaAppId, algoliaPublicKey } = useConfiguration();

    const searchClient = useMemo(
        () => algoliaSearch(algoliaAppId!, algoliaPublicKey!),
        [algoliaAppId, algoliaPublicKey],
    );

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

    function handleEditServiceLevelPress(
        e: React.MouseEvent<HTMLSpanElement, MouseEvent> | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) {
        // Preventing page refresh
        e.preventDefault();
        dispatch(backStep());
    }

    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title="Add cards to your submission"
                    description={
                        'Search for a card below and click the "+" icon, then enter the quantity and value for each card.'
                    }
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        <InstantSearch searchClient={searchClient} indexName={`${appEnv}_card_products`}>
                            {isMobile ? <CardsSearchMobileModal /> : null}
                            <CardSubmissionSearchField />
                            {searchValue !== '' && !isMobile ? <CardsSearchResults /> : null}
                            <AddedSubmissionCards mobileMode={isMobile} />
                            {!areSelectedCardsValuesValid() ? (
                                <>
                                    <Alert severity="error" className={classes.valueAlert}>
                                        Card's value can't be higher than the protection level.
                                    </Alert>
                                    <Alert severity={'info'} className={classes.valueAlert}>
                                        You can easily upgrade your service level by&nbsp;
                                        <Link href={''} onClick={handleEditServiceLevelPress}>
                                            clicking here
                                        </Link>
                                        .
                                    </Alert>
                                </>
                            ) : null}
                            <Configure hitsPerPage={20} />
                        </InstantSearch>
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

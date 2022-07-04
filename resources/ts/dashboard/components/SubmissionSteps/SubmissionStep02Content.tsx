import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import algoliaSearch from 'algoliasearch';
import React, { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { backStep, setIsCleaningFee, setIsNextDisabled } from '../../redux/slices/newSubmissionSlice';
import AddedSubmissionCards from '../AddedSubmissionCards';
import CardSubmissionSearchField from '../CardSubmissionSearchField';
import CardsSearchMobileModal from '../CardsSearchMobileModal';
import CardsSearchResults from '../CardsSearchResults';
import StepDescription from '../StepDescription';

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
    cleaningFeeContainer: {
        marginTop: '32px',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        padding: '16px',
    },
    cleaningText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
});

const TOOLTIP_TEXT = `We offer a professional cleaning service in which we carefully remove any dirt or dust from your card. Dirt and dust may cause your card to get a lower grade then you would get otherwise. Card cleaning costs $5.00 per card and can help improve your grade by 0.5/10 points. What does up to $100 mean? We won’t charge you any more than $100 for a cleaning, which means any time you submit more than 20 cards, and opt in for cleaning, we will only charge a cleaning fee for the first 20 cards and the rest will be cleaned for FREE!`;

function SubmissionStep02Content() {
    const classes = useStyles();
    const searchValue = useAppSelector((state) => state.newSubmission.step02Data.searchValue);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const isCleaningFee = useAppSelector((state) => state.newSubmission.step02Data.isCleaningFee);
    const protectionLimit = useAppSelector(
        (state) => state.newSubmission?.step01Data?.selectedServiceLevel.maxProtectionAmount,
    );
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const { appEnv, algoliaAppId, algoliaPublicKey, searchCardCategoriesCustomer } = useConfiguration();

    const searchClient = useMemo(
        () => algoliaSearch(algoliaAppId!, algoliaPublicKey!),
        [algoliaAppId, algoliaPublicKey],
    );

    function setShippingFee() {
        dispatch(setIsCleaningFee(!isCleaningFee));
    }

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
        <>
            <StepDescription
                title="Add cards to your submission"
                description={
                    'Search for a card below and click the "+" icon, then enter the quantity and value for each card.'
                }
            />
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
                    {searchCardCategoriesCustomer ? (
                        <Configure
                            hitsPerPage={20}
                            filters={`card_category_name:${searchCardCategoriesCustomer.replace(
                                /,/g,
                                ' OR card_category_name:',
                            )}`}
                        />
                    ) : (
                        <Configure hitsPerPage={20} />
                    )}
                </InstantSearch>
            </div>
            <div className={classes.cleaningFeeContainer}>
                <Box display={'flex'} alignItems={'center'}>
                    <Typography>Card Cleaning Fee</Typography>
                    <Tooltip title={TOOLTIP_TEXT}>
                        <IconButton aria-label="info">
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box display={'flex'}>
                    <Typography className={classes.cleaningText} variant={'subtitle1'}>
                        Would you like us to clean the card(s) in this submission?
                    </Typography>
                </Box>
                <FormControlLabel
                    sx={{ marginTop: '10px' }}
                    control={<Checkbox color={'primary'} onChange={setShippingFee} checked={isCleaningFee} />}
                    label={
                        <Box display={'flex'} alignItems={'center'}>
                            <Typography>
                                Yes, clean my cards for an additional $5.00 per card.
                                <span className={classes.cleaningText}>{'  '} (Up to $100)</span>
                            </Typography>
                        </Box>
                    }
                />
            </div>
        </>
    );
}

export default SubmissionStep02Content;

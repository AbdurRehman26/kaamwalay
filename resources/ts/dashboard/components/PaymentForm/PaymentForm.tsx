import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { EventCategories, PaymentMethodEvents } from '@shared/constants/GAEventsTypes';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { APIService } from '@shared/services/APIService';
import CustomerStripeCardItem from '@dashboard/components/PaymentForm/CustomerStripeCardItem';
import useStyles from '@dashboard/components/PaymentForm/style';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { saveStripeCustomerCards } from '@dashboard/redux/slices/newSubmissionSlice';

const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
        base: {
            color: '#32325D',
            fontWeight: 500,
            fontFamily: 'Inter, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            '::placeholder': {
                color: '#CFD7DF',
            },
        },
        invalid: {
            color: '#E25950',
        },
    },
};

// noinspection JSIgnoredPromiseFromCall
export function PaymentForm() {
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [isSaveBtnLoading, setSaveBtnLoading] = useState(false);
    const [isCardsListLoading, setIsCardsListLoading] = useState(false);
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const existingCustomerStripeCards = useAppSelector((state) => state.newSubmission.step04Data.existingCreditCards);

    const stripe = useStripe();
    const elements = useElements();

    const notifications = useNotifications();
    const apiService = useInjectable(APIService);

    const saveExistingStripeCards = async () => {
        const endpoint = apiService.createEndpoint('customer/payment-cards');
        try {
            setIsCardsListLoading(true);
            const existingStripeCardsForCustomer = await endpoint.get('');
            const formattedStripeCards = existingStripeCardsForCustomer.data?.map((item: any) => {
                return {
                    expMonth: item.card.expMonth,
                    expYear: item.card.expYear,
                    last4: item.card.last4,
                    brand: item.card.brand,
                    id: item.id,
                };
            });
            if (existingStripeCardsForCustomer?.data?.length === 0) {
                dispatch(saveStripeCustomerCards([]));
            } else {
                dispatch(saveStripeCustomerCards(formattedStripeCards));
            }
            setIsCardsListLoading(false);
            setShowAddCardModal(false);
        } catch (error: any) {
            setIsCardsListLoading(false);
            notifications.error("We weren't able to get your existing cards", 'Error');
        }
    };

    const handleClickOpen = () => {
        setShowAddCardModal(true);
    };

    const handleClose = () => {
        setShowAddCardModal(false);
    };

    const handleSaveCard = async () => {
        const endpoint = apiService.createEndpoint('customer/payment-cards/setup');
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable submission until it loaded ;).
            return;
        }
        setSaveBtnLoading(true);
        // Get stripe client secret from back-end in order to use it to save the card
        const requestClientSecret = await endpoint.post('');

        // We're using the client secret now in order to save the card for the customer on stripe
        const result = await stripe.confirmCardSetup(requestClientSecret.data.intent.clientSecret, {
            // eslint-disable-next-line camelcase
            payment_method: {
                card: elements.getElement(CardElement) as any,
            },
        });
        // The card couldn't be saved to stripe
        if (result.error) {
            // Let the user know we couldn't save his card
            setSaveBtnLoading(false);
            notifications.error(result.error.message!, 'Error');
        } else {
            // The card has been successfully saved to stripe, now we ask the back-end to send us all the stripe cards for this customer
            // we're then listing them on the page
            await saveExistingStripeCards();
            notifications.success('Your card was successfully saved', 'Card saved');
            setSaveBtnLoading(false);
            ReactGA.event({
                category: EventCategories.PaymentMethods,
                action: PaymentMethodEvents.addedNewStripeCard,
            });
        }
    };

    useEffect(
        () => {
            // noinspection JSIgnoredPromiseFromCall
            saveExistingStripeCards();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    if (isCardsListLoading) {
        return (
            <div className={classes.loadingContainer}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

    if (existingCustomerStripeCards?.length === 0) {
        return (
            <div className={classes.missingStripeCardsContainer}>
                <Typography className={classes.cardsListTitle}>Add debit / credit card</Typography>
                <div className={classes.firstTimeCardContainer}>
                    <CardElement options={CARD_OPTIONS as any} className={classes.cardForm} />
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        disabled={isSaveBtnLoading}
                        onClick={handleSaveCard}
                        className={classes.addCardBtn}
                    >
                        {isSaveBtnLoading ? 'Loading...' : 'Add credit/debit card'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Dialog open={showAddCardModal} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">Add a new card</DialogTitle>
                <DialogContent>
                    <div className={classes.newCardFormContainer}>
                        <CardElement options={CARD_OPTIONS as any} className={classes.cardForm} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveCard} color="primary" disabled={isSaveBtnLoading}>
                        {isSaveBtnLoading ? 'Loading...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Typography className={classes.cardsListTitle}>Your cards</Typography>
            <Paper variant="outlined" className={classes.cardsListContainer}>
                {existingCustomerStripeCards?.map((item: any) => (
                    <CustomerStripeCardItem key={item.id} {...item} />
                ))}
                <div className={classes.addNewCardItemContainer}>
                    <Button color="secondary" onClick={handleClickOpen} startIcon={<AddCircleOutlineIcon />}>
                        Add a new debit / credit card
                    </Button>
                </div>
            </Paper>
        </>
    );
}

export default PaymentForm;

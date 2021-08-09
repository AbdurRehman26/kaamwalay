import { CircularProgress, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';

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
export default function PaymentForm() {
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const classes = useStyles();
    const dispatch = useAppDispatch();
    // This will be coming from a redux slice, it will be put there when the user logs in
    const existingCustomerStripeCards = useAppSelector((state) => state.newSubmission.step04Data.existingCreditCards);
    const stripe = useStripe();
    const elements = useElements();
    const [isSaveBtnLoading, setSaveBtnLoading] = useState(false);
    const [isCardsListLoading, setIsCardsListLoading] = useState(false);
    const notifications = useNotifications();

    const apiService = useInjectable(APIService);

    const saveExistingStripeCards = async () => {
        const endpoint = apiService.createEndpoint('customer/payment-methods');
        try {
            setIsCardsListLoading(true);
            const existingStripeCardsForCustomer = await endpoint.get('');
            const formattedStripeCards = existingStripeCardsForCustomer.data?.map((item: any) => {
                return {
                    expMonth: item.card.exp_month,
                    expYear: item.card.exp_year,
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
        } catch (error) {
            console.log(error);
            setIsCardsListLoading(false);
            notifications.error("We weren't able to get your existing cards", 'Error');
        }
    };

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        saveExistingStripeCards();
    }, []);

    const handleClickOpen = () => {
        setShowAddCardModal(true);
    };

    const handleClose = () => {
        setShowAddCardModal(false);
    };

    const handleSaveCard = async (e: any) => {
        const endpoint = apiService.createEndpoint('customer/payment-methods/setup');
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable submission until it loaded ;).
            return;
        }
        setSaveBtnLoading(true);
        // Get stripe client secret from back-end in order to use it to save the card
        const requestClientSecret = await endpoint.post('');

        // We're using the client secret now in order to save the card for the customer on stripe
        const result = await stripe.confirmCardSetup(requestClientSecret.data.intent.client_secret, {
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
        }
    };

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
                {isCardsListLoading ? (
                    <div className={classes.loadingContainer}>
                        <CircularProgress color="secondary" />
                    </div>
                ) : (
                    <>
                        {existingCustomerStripeCards?.length === 0 ? (
                            <div className={classes.missingStripeCardsContainer}>
                                <Typography variant={'subtitle1'}>You don't have any saved cards</Typography>
                                <Button variant={'contained'} color={'primary'} onClick={handleClickOpen}>
                                    Add credit/debit card
                                </Button>
                            </div>
                        ) : (
                            <>
                                {existingCustomerStripeCards?.map((item) => {
                                    return <CustomerStripeCardItem key={item.id} {...item} />;
                                })}
                                <div className={classes.addNewCardItemContainer}>
                                    <Button
                                        color="secondary"
                                        onClick={handleClickOpen}
                                        startIcon={<AddCircleOutlineIcon />}
                                    >
                                        Add a new debit / credit card
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </Paper>
        </>
    );
}

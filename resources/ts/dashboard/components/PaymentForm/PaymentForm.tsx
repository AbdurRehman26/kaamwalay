import { Paper } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { getPaymentIcon } from '@shared/lib/payments';

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
    const { success, setSuccess }: any = useState(false);
    const [clientSecret, setClientSecret]: any = useState('');
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const classes = useStyles();
    const dispatch = useAppDispatch();
    // This will be coming from a redux slice, it will be put there when the user logs in
    const existingStripeCustomerID = 'cus_JznJFVaa5nnDfj';
    const existingCustomerStripeCards = useAppSelector((state) => state.newSubmission.step04Data.existingCreditCards);
    const stripe = useStripe();
    const elements = useElements();

    const saveExistingStripeCards = useCallback(async () => {
        await axios.get(`http://localhost:1337/stripe-cards/${existingStripeCustomerID}`).then((r) => {
            const formattedStripeCards = r.data.paymentMethods.data.map((item: any) => {
                return {
                    expMonth: item.card.exp_month,
                    expYear: item.card.exp_year,
                    last4: item.card.last4,
                    brand: item.card.brand,
                    id: item.id,
                };
            });
            dispatch(saveStripeCustomerCards(formattedStripeCards));
            setShowAddCardModal(false);
        });
    }, []);

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
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable submission until it loaded ;).
            return;
        }

        await axios.get(`http://localhost:1337/stripe-client-secret/${existingStripeCustomerID}`).then((r) => {
            setClientSecret(r.data.clientSecret);
        });

        const result = await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as any,
            },
        });
        if (result.error) {
            // Display result.error.message in your UI.
            console.log(result.error);
        } else {
            // The setup has succeeded. Display a success message and send
            // result.setupIntent.payment_method to your server to save the
            // card to a Customer
            await saveExistingStripeCards();
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
                    <Button onClick={handleSaveCard} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Typography className={classes.cardsListTitle}>Your cards</Typography>
            <Paper variant="outlined" className={classes.cardsListContainer}>
                {existingCustomerStripeCards!.length === 0 ? (
                    <div className={classes.missingStripeCardsContainer}>
                        <Typography variant={'subtitle1'}>You don't have any saved cards</Typography>
                        <Button variant={'contained'} color={'primary'} onClick={handleClickOpen}>
                            Add credit/debit card
                        </Button>
                    </div>
                ) : (
                    <>
                        {existingCustomerStripeCards!.map((item) => {
                            return <CustomerStripeCardItem key={item.id} {...item} />;
                        })}
                        <div className={classes.addNewCardItemContainer}>
                            <Button color="secondary" onClick={handleClickOpen} startIcon={<AddCircleOutlineIcon />}>
                                Add a new debit / credit card
                            </Button>
                        </div>
                    </>
                )}
            </Paper>
        </>
    );
}

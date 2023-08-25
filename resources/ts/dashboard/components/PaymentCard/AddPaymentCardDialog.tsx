import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useCallback, useState } from 'react';
import ReactGA from 'react-ga4';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';
import { EventCategories, PaymentMethodEvents } from '@shared/constants/GAEventsTypes';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { trackFacebookPixelEvent } from '@shared/lib/utils/trackFacebookPixelEvent';
import { APIService } from '@shared/services/APIService';

interface AddPaymentCardDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle?: string;
    onSubmit(): Promise<void> | void;
}

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

const useStyles = makeStyles(
    (theme: Theme) =>
        createStyles({
            dialogActions: {
                marginBottom: '12px',
                marginRight: '18px',
            },
            contentContainer: {
                width: '457px',
                [theme.breakpoints.down('sm')]: {
                    width: '100%',
                },
            },
            saveBtn: {
                marginLeft: '12px',
            },
            newCardFormContainer: {
                width: '550px',
            },
            cardForm: {
                iconStyle: 'solid',
                style: {
                    base: {
                        iconColor: '#c4f0ff',
                        color: '#fff',
                        fontWeight: 500,
                        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                        fontSize: '16px',
                        fontSmoothing: 'antialiased',

                        ':-webkit-autofill': {
                            color: '#fce883',
                        },
                        '::placeholder': {
                            color: '#87BBFD',
                        },
                    },
                    invalid: {
                        iconColor: '#FFC7EE',
                        color: '#FFC7EE',
                    },
                },
            },
        }),
    { name: 'PaymentCardDeleteDialog' },
);

function AddPaymentCardDialog(props: AddPaymentCardDialogProps) {
    const { dialogTitle, onClose, onSubmit, ...rest } = props;
    const classes = useStyles();
    const [isSaveBtnLoading, setSaveBtnLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const apiService = useInjectable(APIService);
    const notifications = useNotifications();

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    const handleSubmit = useCallback(async () => {
        const endpoint = apiService.createEndpoint('customer/payment-cards/setup');
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable submission until it loaded ;).
            return;
        }
        setSaveBtnLoading(true);
        try {
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
                notifications.success('Your card was successfully saved', 'Card saved');
                setSaveBtnLoading(false);
                ReactGA.event({
                    category: EventCategories.PaymentMethods,
                    action: PaymentMethodEvents.addedNewStripeCard,
                });
                trackFacebookPixelEvent(FacebookPixelEvents.AddPaymentInfo);
                onSubmit();
            }
        } catch (e) {
            console.error(e);
            // Treat errors.
        } finally {
            setSaveBtnLoading(false);
        }

        handleClose();
    }, [onSubmit, apiService, elements, handleClose, notifications, stripe]);

    return (
        <Dialog onClose={handleClose} {...rest}>
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
                <Button onClick={handleSubmit} color="primary" disabled={isSaveBtnLoading}>
                    {isSaveBtnLoading ? 'Loading...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddPaymentCardDialog;

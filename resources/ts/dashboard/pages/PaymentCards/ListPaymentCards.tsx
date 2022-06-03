import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';
import { EventCategories, PaymentMethodEvents } from '@shared/constants/GAEventsTypes';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { trackFacebookPixelEvent } from '@shared/lib/utils/trackFacebookPixelEvent';
import { APIService } from '@shared/services/APIService';
import { ListHeader } from '@dashboard/components/ListHeader/ListHeader';
import PaymentCardItem from '@dashboard/components/PaymentCard/PaymentCardItem';
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

const useStyles = makeStyles(
    (theme) => ({
        newShipmentBtn: {
            borderRadius: 24,
            padding: '12px 24px',
            [theme.breakpoints.down('sm')]: {
                marginLeft: 'auto',
                padding: '9px 16px',
            },
        },
        paymentCards: {
            marginTop: '5%',
            width: '100%',
        },
    }),
    {
        name: 'ListVaultShipmentsPage',
    },
);

export function ListPaymentCards() {
    const classes = useStyles();
    const apiService = useInjectable(APIService);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const [isCardsListLoading, setIsCardsListLoading] = useState(false);
    const [isSaveBtnLoading, setSaveBtnLoading] = useState(false);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const dispatch = useAppDispatch();
    const existingCustomerStripeCards = useAppSelector((state) => state.newSubmission.step04Data.existingCreditCards);

    const notifications = useNotifications();
    const stripe = useStripe();
    const elements = useElements();

    const loadExistingStripeCards = async () => {
        const endpoint = apiService.createEndpoint('customer/payment-cards');
        try {
            setIsCardsListLoading(true);
            const existingStripeCardsForCustomer = await endpoint.get('');
            console.log(existingStripeCardsForCustomer, 112131);
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
            if (error.response?.status !== 401) {
                notifications.error("We weren't able to get your existing cards", 'Error');
            }
        }
    };

    useEffect(
        () => {
            // noinspection JSIgnoredPromiseFromCall
            loadExistingStripeCards();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const handleSaveCard = async () => {
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
                // The card has been successfully saved to stripe, now we ask the back-end to send us all the stripe cards for this customer
                // we're then listing them on the page
                await loadExistingStripeCards();
                notifications.success('Your card was successfully saved', 'Card saved');
                setSaveBtnLoading(false);
                ReactGA.event({
                    category: EventCategories.PaymentMethods,
                    action: PaymentMethodEvents.addedNewStripeCard,
                });
                trackFacebookPixelEvent(FacebookPixelEvents.AddPaymentInfo);
            }
        } catch (e) {
            console.error(e);
            // Treat errors.
        } finally {
            setSaveBtnLoading(false);
        }
    };

    const $newCard = (
        <Button
            onClick={() => setShowAddCardModal(true)}
            variant={'contained'}
            color={'primary'}
            className={classes.newShipmentBtn}
        >
            Add a Card
        </Button>
    );

    if (isCardsListLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <ListHeader headline={'Save Credit Cards'} noMargin noSearch actions={isMobile ? $newCard : null}>
                {!isMobile ? $newCard : null}
            </ListHeader>

            <div className={classes.paymentCards}>
                {existingCustomerStripeCards?.map((item: any) => (
                    <PaymentCardItem key={item.id} {...item} />
                ))}
            </div>

            <Dialog open={showAddCardModal} onClose={() => setShowAddCardModal(false)}>
                <DialogTitle id="form-dialog-title">Add a new card</DialogTitle>
                <DialogContent>
                    <div>
                        <CardElement options={CARD_OPTIONS as any} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddCardModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveCard} color="primary" disabled={isSaveBtnLoading}>
                        {isSaveBtnLoading ? 'Loading...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

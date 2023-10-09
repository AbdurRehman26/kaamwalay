import Grid from '@mui/material/Grid';
import React, { useCallback, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useNavigate, useParams } from 'react-router-dom';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { useAuth } from '@shared/hooks/useAuth';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { RetryStrategy, useRetry } from '@shared/hooks/useRetry';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { pushDataToRefersion } from '@shared/lib/utils/pushDataToRefersion';
import { trackFacebookPixelEvent } from '@shared/lib/utils/trackFacebookPixelEvent';
import { useOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getAffirmPaymentStatus } from '@dashboard/redux/slices/newSubmissionSlice';
import { ConfirmationLoadingSidebar } from '../CollectorCoinConfirmationSubmission/ConfirmationLoadingSidebar';
import { useConfirmationSubmissionStyles } from '../CollectorCoinConfirmationSubmission/style';

export function AffirmConfirmationSubmission() {
    const { id } = useParams<{ id: string }>();
    const [query] = useLocationQuery<{ payment_intent: string }>();
    const user$ = useAuth().user;

    const classes = useConfirmationSubmissionStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isPaymentSuccessful = useAppSelector((state) => state.newSubmission.confirmedAffirmPayment);

    const { isLoading, data } = useOrderQuery({
        resourceId: Number(id),
    });

    const sendECommerceDataToGA = useCallback(() => {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.placed,
        });

        ReactGA.gtag('event', 'add_to_cart', {
            items: [
                {
                    // eslint-disable-next-line
                    item_id: String(id),
                    // eslint-disable-next-line
                    item_name: `${data?.paymentPlan?.turnaround} turnaround with $${data?.paymentPlan?.maxProtectionAmount} insurance`,
                    // eslint-disable-next-line
                    item_category: 'Cards',
                    price: data?.paymentPlan?.price,
                    quantity: data?.numberOfCards,
                },
            ],
        });

        ReactGA.gtag('event', 'purchase', {
            // eslint-disable-next-line
            transaction_id: String(id),
            value: data?.grandTotal,
            currency: 'USD',
            shipping: data?.shippingFee,
        });

        ReactGA.gtag('event', 'send', null);
        ReactGA.gtag('event', 'clear', null);
    }, [
        data?.grandTotal,
        data?.numberOfCards,
        data?.paymentPlan?.maxProtectionAmount,
        data?.paymentPlan?.price,
        data?.paymentPlan?.turnaround,
        data?.shippingFee,
        id,
    ]);

    useEffect(() => {
        if (isPaymentSuccessful) {
            ReactGA.event({
                category: EventCategories.Submissions,
                action: SubmissionEvents.paid,
            });
            trackFacebookPixelEvent(FacebookPixelEvents.Purchase, {
                value: data?.grandTotal,
                currency: 'USD',
            });
            sendECommerceDataToGA();
            googleTagManager({ event: 'google-ads-purchased', value: data?.grandTotal });
            pushDataToRefersion(data, user$);
            window.location.href = `/dashboard/submissions/${id}/view`;
        }
    }, [dispatch, isPaymentSuccessful, id, navigate, data, sendECommerceDataToGA, user$]);

    useRetry(
        async () => {
            if (!isLoading && data && query.payment_intent) {
                await dispatch(
                    getAffirmPaymentStatus({
                        orderID: Number(id),
                        paymentIntentId: query.payment_intent ?? '',
                    }),
                );
            }
        },
        () => !isPaymentSuccessful,
        { maxRetries: 5, strategy: RetryStrategy.ExecuteFirst },
    );
    return (
        <Grid container>
            <Grid item className={classes.sidebar} maxWidth={'100% !important'}>
                <ConfirmationLoadingSidebar />
            </Grid>
        </Grid>
    );
}

export default AffirmConfirmationSubmission;

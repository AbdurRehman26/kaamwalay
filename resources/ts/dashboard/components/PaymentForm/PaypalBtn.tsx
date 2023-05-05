// noinspection BadExpressionStatementJS
import React, { useEffect, useRef } from 'react';
import ReactGA from 'react-ga4';
import { useDispatch } from 'react-redux';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { useAuth } from '@shared/hooks/useAuth';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { pushDataToRefersion } from '@shared/lib/utils/pushDataToRefersion';
import { trackFacebookPixelEvent } from '@shared/lib/utils/trackFacebookPixelEvent';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { APIService } from '@shared/services/APIService';
import { useAppSelector } from '@dashboard/redux/hooks';
import { clearSubmissionState } from '@dashboard/redux/slices/newSubmissionSlice';

function PaypalBtn() {
    const contentRef = useRef<HTMLDivElement>(null);
    const apiService = useInjectable(APIService);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const grandTotal = useAppSelector((state) => state.newSubmission.grandTotal);
    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);
    const paymentMethodID = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const currentSelectedTurnaround = useAppSelector(
        (state) => state.newSubmission.step01Data.selectedServiceLevel.turnaround,
    );
    const currentSelectedMaxProtection = useAppSelector(
        (state) => state.newSubmission.step01Data.selectedServiceLevel.maxProtectionAmount,
    );
    const currentSelectedLevelPrice = useAppSelector(
        (state) => state.newSubmission.step01Data.selectedServiceLevel.price,
    );
    const shippingFee = useAppSelector((state) => state.newSubmission.step02Data.shippingFee);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const numberOfSelectedCards = (selectedCards || []).reduce((prev: number, cur) => prev + (cur.qty ?? 1), 0);
    const orderSubmission = useAppSelector((state) => state.newSubmission);
    const user$ = useAuth().user;
    const couponCode = useAppSelector((state) => state.newSubmission.couponState.couponCode);
    const originalPaymentPlanId = useAppSelector((state) => state.newSubmission?.step01Data?.originalServiceLevel.id);

    const notifications = useNotifications();
    const dispatch = useDispatch();

    const sendECommerceDataToGA = () => {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.paid,
        });

        ReactGA.gtag('event', 'addItem', {
            id: String(orderID),
            name: `${currentSelectedTurnaround} turnaround with $${currentSelectedMaxProtection} insurance`,
            category: 'Cards',
            price: String(currentSelectedLevelPrice),
            quantity: String(numberOfSelectedCards),
        });

        ReactGA.gtag('event', 'addTransaction', {
            id: String(orderID), // Doing these type coercions because GA wants this data as string
            revenue: String(grandTotal),
            shipping: String(shippingFee),
        });

        ReactGA.gtag('event', 'send', null);
        ReactGA.gtag('event', 'clear', null);
    };

    useEffect(
        () => {
            // @ts-ignore
            window.paypal
                .Buttons({
                    createOrder: async function () {
                        const endpoint = apiService.createEndpoint(`customer/orders/${orderID}/payments`);
                        const response = await endpoint.post('', {
                            paymentByWallet: appliedCredit,
                            paymentMethod: {
                                id: paymentMethodID,
                            },
                            ...(couponCode && {
                                coupon: {
                                    code: couponCode,
                                },
                                paymentPlan: {
                                    id: originalPaymentPlanId,
                                },
                            }),
                        });
                        return response.data.id;
                    },
                    onApprove: async function (data: any, actions: any) {
                        try {
                            const endpoint = apiService.createEndpoint(
                                `customer/orders/${orderID}/payments/${data.orderID}`,
                            );
                            const orderData = await endpoint.post('');

                            const errorDetail =
                                Array.isArray(orderData.data.details ?? '') && orderData.data.details[0];
                            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                                return actions.restart(); // Recoverable state, per:
                                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
                            }
                            if (errorDetail) {
                                let msg = 'Sorry, your transaction could not be processed.';
                                if (errorDetail.description) msg += '\n\n' + errorDetail.description;
                                notifications.error(msg, 'Error');
                                return;
                            }
                            notifications.success('Order paid!', 'Success!');
                            dispatch(clearSubmissionState());
                            dispatch(invalidateOrders());
                            trackFacebookPixelEvent(FacebookPixelEvents.Purchase, {
                                value: grandTotal,
                                currency: 'USD',
                            });
                            sendECommerceDataToGA();
                            googleTagManager({ event: 'google-ads-purchased', value: grandTotal });
                            pushDataToRefersion(orderSubmission, user$);
                            window.location.href = `/dashboard/submissions/${orderID}/view`;
                        } catch (err: any) {
                            notifications.error('Payment could not be processed!', 'Error');
                        }
                    },
                })
                .render(contentRef.current);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <div>
            <div ref={contentRef} />
        </div>
    );
}

export default PaypalBtn;

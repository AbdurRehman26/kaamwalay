// noinspection BadExpressionStatementJS
import React, { useEffect, useRef } from 'react';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { APIService } from '@shared/services/APIService';
import { useAppSelector } from '@dashboard/redux/hooks';
import { clearSubmissionState } from '@dashboard/redux/slices/newSubmissionSlice';
import trackFbPixelEvent from '@shared/lib/utils/trackFbPixelEvent';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';

function PaypalBtn() {
    const contentRef = useRef<HTMLDivElement>(null);
    const apiService = useInjectable(APIService);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const grandTotal = useAppSelector((state) => state.newSubmission.grandTotal);
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
    const notifications = useNotifications();
    const history = useHistory();
    const dispatch = useDispatch();

    const sendECommerceDataToGA = () => {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.paid,
        });

        ReactGA.plugin.execute('ecommerce', 'addItem', {
            id: String(orderID),
            name: `${currentSelectedTurnaround} turnaround with $${currentSelectedMaxProtection} insurance`,
            category: 'Cards',
            price: String(currentSelectedLevelPrice),
            quantity: String(numberOfSelectedCards),
        });

        ReactGA.plugin.execute('ecommerce', 'addTransaction', {
            id: String(orderID), // Doing these type coercions because GA wants this data as string
            revenue: String(grandTotal),
            shipping: String(shippingFee),
        });

        ReactGA.plugin.execute('ecommerce', 'send', null);
        ReactGA.plugin.execute('ecommerce', 'clear', null);
    };

    useEffect(
        () => {
            // @ts-ignore
            window.paypal
                .Buttons({
                    createOrder: async function () {
                        const endpoint = apiService.createEndpoint(`customer/orders/${orderID}/payments`);
                        const response = await endpoint.post('');
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
                            trackFbPixelEvent(FacebookPixelEvents.Purchase, {
                                value: grandTotal,
                                currency: 'USD',
                            });
                            sendECommerceDataToGA();
                            history.push(`/submissions/${orderID}/confirmation`);
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

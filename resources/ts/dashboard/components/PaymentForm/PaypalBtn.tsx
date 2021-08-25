// noinspection BadExpressionStatementJS
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { APIService } from '@shared/services/APIService';
import { useAppSelector } from '@dashboard/redux/hooks';
import { clearSubmissionState } from '@dashboard/redux/slices/newSubmissionSlice';

function PaypalBtn() {
    const contentRef = useRef<HTMLDivElement>(null);
    const apiService = useInjectable(APIService);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const notifications = useNotifications();
    const history = useHistory();
    const dispatch = useDispatch();

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
                            history.push(`/submissions/${orderID}/confirmation`);
                        } catch (err) {
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

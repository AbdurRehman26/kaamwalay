// noinspection BadExpressionStatementJS
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { APIService } from '@shared/services/APIService';

import { useAppSelector } from '@dashboard/redux/hooks';

function PaypalBtn() {
    const paypal = useRef();
    const apiService = useInjectable(APIService);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const notifications = useNotifications();
    const history = useHistory();
    useEffect(() => {
        // @ts-ignore
        window.paypal
            .Buttons({
                createOrder: async function (data: any, actions: any) {
                    const endpoint = apiService.createEndpoint(`customer/orders/${orderID}/payments`);
                    const response = await endpoint.post('');
                    return response.data.id;
                },
                onApprove: async function (data: any, actions: any) {
                    const endpoint = apiService.createEndpoint(`customer/orders/${orderID}/payments/${data.orderID}`);
                    const orderData = await endpoint.post('');
                    const errorDetail = Array.isArray(orderData.data.details ?? '') && orderData.data.details[0];

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
                    history.push(`/submissions/${orderID}/confirmation`);
                },
            })
            .render(paypal.current);
    }, []);

    return (
        <div>
            <div ref={paypal as any}></div>
        </div>
    );
}

export default PaypalBtn;

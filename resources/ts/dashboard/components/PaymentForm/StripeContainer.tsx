import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import React from 'react';

import PaymentForm from '@dashboard/components/PaymentForm/PaymentForm';

const PUBLIC_KEY =
    'pk_test_51IyisDJCai8r8pbfP0QzvR9QB47yJSw1HrSrRPkaVVNLaMGu9WrOv5yzQ6H6PtVE1fFNXYLKKD0nzVh0WA6A6xar00MAw5Tgrl';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer(props: any) {
    return <Elements stripe={stripeTestPromise}>{props.children}</Elements>;
}

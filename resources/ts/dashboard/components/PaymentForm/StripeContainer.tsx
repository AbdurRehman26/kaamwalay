import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import React, { PropsWithChildren } from 'react';

const stripeTestPromise = loadStripe(process.env.MIX_STRIPE_PUBLIC_KEY!);

export default function StripeContainer(props: PropsWithChildren<any>) {
    return <Elements stripe={stripeTestPromise}>{props.children}</Elements>;
}

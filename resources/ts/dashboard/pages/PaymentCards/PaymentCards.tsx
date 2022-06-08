import React from 'react';
import StripeContainer from '@dashboard/components/PaymentForm/StripeContainer';
import { ListPaymentCards } from './ListPaymentCards';

export function PaymentCards() {
    return (
        <StripeContainer>
            <ListPaymentCards />
        </StripeContainer>
    );
}

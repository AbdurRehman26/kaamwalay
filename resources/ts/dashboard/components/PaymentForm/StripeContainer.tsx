import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';

export default function StripeContainer({ children }: PropsWithChildren<any>) {
    const isLoading = useSharedSelector((state) => state.configuration.isLoading);

    const { stripeKey } = useConfiguration();
    const [stripe, setStripe] = useState<any>(null);

    useEffect(
        () => {
            if (stripeKey && !isLoading) {
                setStripe(null);
                loadStripe(stripeKey).then(setStripe);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setStripe],
    );

    if (!stripe || isLoading) {
        return (
            <Box display={'flex'} padding={3} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    return <Elements stripe={stripe}>{children}</Elements>;
}

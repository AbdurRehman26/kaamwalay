import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import React, { PropsWithChildren, useEffect, useState } from 'react';

import { useConfiguration } from '@shared/hooks/useConfiguration';

export default function StripeContainer({ children }: PropsWithChildren<any>) {
    const { stripeKey } = useConfiguration();
    const [stripe, setStripe] = useState<any>(null);

    useEffect(() => {
        setStripe(null);
        loadStripe(stripeKey).then(setStripe);
    }, [setStripe]);

    if (!stripe) {
        return (
            <Box display={'flex'} padding={3} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    return <Elements stripe={stripe}>{children}</Elements>;
}

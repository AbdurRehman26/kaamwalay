import Grid from '@mui/material/Grid';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { RetryStrategy, useRetry } from '@shared/hooks/useRetry';
import { useOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getAffirmPaymentStatus } from '@dashboard/redux/slices/newSubmissionSlice';
import { ConfirmationLoadingSidebar } from '../CollectorCoinConfirmationSubmission/ConfirmationLoadingSidebar';
import { useConfirmationSubmissionStyles } from './style';

export function AffirmConfirmationSubmission() {
    const { id } = useParams<{ id: string }>();
    const [query] = useLocationQuery<{ payment_intent: string }>();

    const classes = useConfirmationSubmissionStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isPaymentSuccessful = useAppSelector((state) => state.newSubmission.confirmedAffirmPayment);

    const { isLoading, data } = useOrderQuery({
        resourceId: Number(id),
    });

    useEffect(() => {
        if (isPaymentSuccessful) {
            // window.location.href = `/dashboard/submissions/${id}/view`
        }
    }, [dispatch, isPaymentSuccessful, id, navigate]);

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

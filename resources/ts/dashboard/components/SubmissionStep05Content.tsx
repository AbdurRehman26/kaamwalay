import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import OrderReviewSection from '@dashboard/components/SubmissionOrderReview/OrderReviewSection';
import AddedSubmissionCards from './AddedSubmissionCards';
import StepDescription from './StepDescription';
import SubmissionSummary from './SubmissionSummary';
import { AGSPaymentDetailsContainers } from '@dashboard/components/PayWithAGS/PaymentDetailsContainers';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getTotalInAGS } from '@dashboard/redux/slices/newSubmissionSlice';
import Web3 from 'web3';

const useStyles = makeStyles({
    stepDescriptionContainer: {
        maxWidth: '425px',
    },
    leftSideContainer: {
        marginTop: '12px',
    },
    divider: {
        marginTop: '64px',
    },
    valueAlert: {
        marginTop: '16px',
    },
});
function SubmissionStep05Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const paymentMethodID = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    useEffect(() => {
        async function fetchTotalInAGS() {
            // @ts-ignore
            const web3: any = new Web3(window?.web3?.currentProvider);
            // @ts-ignore
            const currentNetworkID = await web3?.eth?.net?.getId();
            if (currentNetworkID) {
                dispatch(getTotalInAGS({ orderID, chainID: currentNetworkID, paymentByWallet: 0.0 }));
                return;
            }
            dispatch(getTotalInAGS({ orderID, chainID: 1, paymentByWallet: 0.0 }));
        }
        fetchTotalInAGS();
    }, [dispatch, orderID]);
    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title="Review your submission"
                    description={
                        <Box maxWidth={342}>
                            Go through all the information you input in the previous steps, and click submit to finish
                            submission.
                        </Box>
                    }
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        {paymentMethodID === 3 ? <AGSPaymentDetailsContainers /> : null}
                        <AddedSubmissionCards reviewMode />
                        <OrderReviewSection />
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SubmissionSummary />
                </Grid>
            </Grid>

            <Divider light className={classes.divider} />
        </Container>
    );
}

export default SubmissionStep05Content;

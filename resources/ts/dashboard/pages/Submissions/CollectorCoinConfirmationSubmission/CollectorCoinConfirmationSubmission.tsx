import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { font } from '@shared/styles/utils';
import { CollectorCoinConfirmationSidebar } from './CollectorCoinConfirmationSidebar';
import { useConfirmationSubmissionStyles } from './style';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { shortenTxnHash } from '@dashboard/components/PayWithAGS/utils';
import Tooltip from '@mui/material/Tooltip';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { RetryStrategy, useRetry } from '@shared/hooks/useRetry';
import { getCollectorCoinPaymentStatus } from '@dashboard/redux/slices/newSubmissionSlice';

export function CollectorCoinConfirmationSubmission() {
    const { id } = useParams<{ id: string }>();
    const classes = useConfirmationSubmissionStyles();
    const dispatch = useAppDispatch();
    const transactionStatus = 'Processing';
    const navigate = useNavigate();
    const notifications = useNotifications();
    const isPaymentSuccessful = useAppSelector((state) => state.newSubmission.confirmedCollectorCoinPayment);
    const transactionHash = useAppSelector((state) => state.newSubmission.orderTransactionHash);

    const handleTransactionHashClick = useCallback(
        (incomingTransactionHash: string) => {
            return () => {
                // This will only work on HTTPS
                navigator.clipboard.writeText(incomingTransactionHash).then(
                    function () {
                        notifications.info('Copied txn hash!');
                    },
                    function () {
                        /* clipboard write failed */
                    },
                );
            };
        },
        [notifications],
    );

    useEffect(() => {
        if (isPaymentSuccessful) {
            navigate(`/submissions/${id}/confirmation`);
        }
    }, [dispatch, isPaymentSuccessful, transactionHash, id, navigate]);

    useRetry(
        async () => {
            await dispatch(getCollectorCoinPaymentStatus({ orderID: Number(id) }));
        },
        () => !isPaymentSuccessful,
        { maxRetries: 520, strategy: RetryStrategy.ExecuteFirst },
    );
    return (
        <Grid container>
            <Grid item className={classes.sidebar}>
                <CollectorCoinConfirmationSidebar orderId={Number(id)} />
            </Grid>
            <Grid item className={classes.content}>
                <Box paddingTop={3} paddingBottom={2.5}>
                    <Typography variant={'h5'} className={font.fontWeightMedium}>
                        Collector Coin Payment Status
                    </Typography>
                </Box>
                <Divider />
                <Box paddingTop={4} paddingBottom={10}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Txn Hash</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <Tooltip title={'Copy Transaction Hash'}>
                                        <TableCell
                                            onClick={handleTransactionHashClick(transactionHash)}
                                            sx={{ cursor: 'pointer' }}
                                            align="left"
                                        >
                                            {shortenTxnHash(transactionHash)}
                                        </TableCell>
                                    </Tooltip>
                                    <TableCell align="right">{transactionStatus}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Grid>
        </Grid>
    );
}

export default CollectorCoinConfirmationSubmission;

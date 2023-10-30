import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@shared/hooks/useNotifications';
import { RetryStrategy, useRetry } from '@shared/hooks/useRetry';
import { useOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { font } from '@shared/styles/utils';
import { shortenTxnHash } from '@dashboard/components/PayWithAGS/utils';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getCollectorCoinPaymentStatus } from '@dashboard/redux/slices/newSubmissionSlice';
import { CollectorCoinConfirmationSidebar } from './CollectorCoinConfirmationSidebar';
import { useConfirmationSubmissionStyles } from './style';

export function CollectorCoinConfirmationSubmission() {
    const { id } = useParams<{ id: string }>();
    const classes = useConfirmationSubmissionStyles();
    const dispatch = useAppDispatch();
    const transactionStatus = 'Processing';
    const navigate = useNavigate();
    const notifications = useNotifications();
    const isPaymentSuccessful = useAppSelector((state) => state.newSubmission.confirmedCollectorCoinPayment);

    const { isLoading, data } = useOrderQuery({
        resourceId: Number(id),
    });

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
            navigate(`/submissions/${id}/view`);
        }
    }, [dispatch, isPaymentSuccessful, id, navigate]);

    useRetry(
        async () => {
            if (!isLoading && data?.orderPayment?.transaction?.completeHash) {
                await dispatch(
                    getCollectorCoinPaymentStatus({
                        orderID: Number(id),
                        txHash: data?.orderPayment?.transaction?.completeHash ?? '',
                    }),
                );
            }
        },
        () => !isPaymentSuccessful,
        { maxRetries: 520, strategy: RetryStrategy.ExecuteFirst },
    );
    return (
        <Grid container>
            <Grid item className={classes.sidebar}>
                <CollectorCoinConfirmationSidebar />
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
                                            onClick={handleTransactionHashClick(
                                                data?.orderPayment?.transaction?.completeHash ?? '',
                                            )}
                                            sx={{ cursor: 'pointer' }}
                                            align="left"
                                        >
                                            {shortenTxnHash(data?.orderPayment?.transaction?.completeHash ?? '')}
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

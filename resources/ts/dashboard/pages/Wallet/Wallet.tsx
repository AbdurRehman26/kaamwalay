import { ListHeader } from '@dashboard/components/ListHeader';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import { useListTransactionsQuery } from '@shared/redux/hooks/useListTransactionsQuery';
import moment from 'moment/moment';
import TableFooter from '@mui/material/TableFooter';
import { TablePagination } from '@shared/components/TablePagination';
import React, { useCallback, useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getAvailableCredit } from '@dashboard/redux/slices/newSubmissionSlice';

const TOOLTIP_TEXT = `Your balance will never expire. We'll automatically apply your Wallet Balance to eligible orders when you checkout. If you would rather not use your balance, you can deselect it when creating an order. 
                    \n\nLimitations: Your Wallet Balance cannot be transferred to other accounts. `;

const useStyles = makeStyles(() => {
    return {
        tableHeadLabel: {
            color: '#0000008A',
            fontSize: '12px',
            fontWeight: 'bold',
        },
        tableRowLabel: {
            fontSize: '14px',
        },
        tableTitle: {
            fontSize: '18px',
            color: 'rgba(0, 0, 0, 0.87)',
            marginLeft: '14px',
            marginTop: '12px',
        },
        balanceContainer: {
            width: '100%',
            backgroundColor: '#5022A7',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            alignItems: 'flex-start',
            borderRadius: '10px',
        },
        balanceTitle: {
            color: '#fff',
            fontSize: '14px',
        },
        balanceValue: {
            color: '#fff',
            fontSize: '32px',
            marginTop: '12px',
        },
    };
});
export function Wallet() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);
    const [showInfo, setShowInfo] = useState(false);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const walletTransactions = useListTransactionsQuery();
    let mainElement;

    const toggleShowInfo = useCallback(() => {
        setShowInfo(true);
        setTimeout(() => {
            setShowInfo(false);
        }, 5000);
    }, []);

    useEffect(() => {
        dispatch(getAvailableCredit()).unwrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (walletTransactions.data?.length === 0) {
        mainElement = (
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                padding={'16px'}
            >
                <AccountBalanceWalletTwoToneIcon />
                <Typography sx={{ marginTop: '6px', marginBottom: '6px' }}>No Wallet History</Typography>
                <Typography variant={'caption'} sx={{ color: 'rgba(0, 0, 0, 0.54)', textAlign: 'center' }}>
                    You have no wallet history. Add to your wallet to get started.
                </Typography>
            </Box>
        );
    }

    if (walletTransactions?.data?.length > 0) {
        mainElement = (
            <TableContainer sx={{ borderRadius: '10px' }}>
                <Typography className={classes.tableTitle}>History</Typography>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant={'caption'} className={classes.tableHeadLabel}>
                                    DATE
                                </Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography variant={'caption'} className={classes.tableHeadLabel}>
                                    DESCRIPTION
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant={'caption'} className={classes.tableHeadLabel}>
                                    AMOUNT
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ backgroundColor: '#fff' }}>
                        {walletTransactions?.data.map((item) => {
                            return (
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        <Typography className={classes.tableRowLabel}>
                                            {moment(item.createdAt).format('MM/DD/YYYY')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography className={classes.tableRowLabel}>{item.description}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography className={classes.tableRowLabel} sx={{ fontWeight: 'bold' }}>
                                            ${item.amount}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination {...walletTransactions?.paginationProps} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    }

    return (
        <>
            <ListHeader headline={'Wallet'} noMargin noSearch>
                {!isMobile ? (
                    <Tooltip title={TOOLTIP_TEXT}>
                        <IconButton aria-label="info">
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </ListHeader>

            <Grid container direction={'row'} marginTop={'21px'} spacing={2}>
                <Grid item xs={12} sm={8} order={{ xs: 2, sm: 1 }}>
                    <Paper
                        variant={'outlined'}
                        sx={{ width: '100%', backgroundColor: '#F9F9F9', borderRadius: '10px' }}
                    >
                        {mainElement}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4} order={{ xs: 1, sm: 2 }}>
                    {showInfo ? (
                        <Alert severity="info" sx={{ marginBottom: '12px' }}>
                            {TOOLTIP_TEXT}
                        </Alert>
                    ) : null}
                    <Paper variant={'outlined'} className={classes.balanceContainer} elevation={2}>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            minWidth={'100%'}
                            alignItems={'center'}
                        >
                            <Typography className={classes.balanceTitle}>Balance</Typography>
                            {isMobile ? (
                                <Tooltip title={TOOLTIP_TEXT}>
                                    <IconButton aria-label="info" onClick={toggleShowInfo}>
                                        <InfoOutlinedIcon sx={{ color: '#fff' }} />
                                    </IconButton>
                                </Tooltip>
                            ) : null}
                        </Box>
                        <Typography className={classes.balanceValue}>${availableCredit}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TablePagination } from '@shared/components/TablePagination';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminSalesRepsCommissionPaymentsQuery } from '@shared/redux/hooks/useAdminSalesRepCommissionPaymentsQuery';

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
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgba(0, 0, 0, 0.87)',
            marginLeft: '20px',
            marginTop: '22px',
            fontWeight: 500,
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

export function CommissionPaymentsTable() {
    const { id } = useParams<'id'>();
    const classes = useStyles();
    const [sortFilter, setSortFilter] = useState(false);

    const handleSort = (value: boolean) => {
        setSortFilter(value);
    };

    const commissions = useAdminSalesRepsCommissionPaymentsQuery({
        params: {
            salesmanId: id,
            sort: '-created_at',
            perPage: 24,
        },
        ...bracketParams(),
    });

    useEffect(
        () => {
            if (!commissions.isLoading) {
                commissions.sort({ sort: sortFilter ? 'created_at' : '-created_at' });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortFilter],
    );

    if (commissions.isLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TableContainer sx={{ borderRadius: '10px', border: '1px solid #E0E0E0' }}>
                <Typography className={classes.tableTitle}>Commission Payments</Typography>
                {commissions.data?.length === 0 ? (
                    <Grid
                        container
                        direction={'row'}
                        marginTop={'21px'}
                        marginLeft={'20px'}
                        spacing={2}
                        mb={{ xs: 3, md: 5 }}
                    >
                        <Grid item xs={12} sm={8} order={{ xs: 2, sm: 1 }}>
                            <Paper
                                variant={'outlined'}
                                sx={{ width: '100%', backgroundColor: '#F9F9F9', borderRadius: '10px' }}
                            >
                                <Grid container justifyContent={'center'} className={'page-content'}>
                                    <Stack p={3} alignItems={'center'} justifyContent={'center'}>
                                        <AccountBalanceWalletTwoToneIcon />
                                        <Typography mt={1} variant={'subtitle1'} fontWeight={700}>
                                            No Commission Payment History
                                        </Typography>
                                        <Typography variant={'caption'} color={'textSecondary'} align={'center'}>
                                            No commission payments have been disbursed to you, yet.
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                ) : (
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant={'caption'} className={classes.tableHeadLabel}>
                                        Date{' '}
                                        <TableSortLabel
                                            sx={{ float: 'left', marginRight: 'auto', color: '#0000008A' }}
                                            onClick={() => handleSort(!sortFilter)}
                                            direction={!sortFilter ? 'desc' : 'asc'}
                                            active={true}
                                        ></TableSortLabel>
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant={'caption'} className={classes.tableHeadLabel}>
                                        Added By
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant={'caption'} className={classes.tableHeadLabel}>
                                        Upload
                                    </Typography>
                                </TableCell>

                                <TableCell align="left">
                                    <Typography variant={'caption'} className={classes.tableHeadLabel}>
                                        Notes
                                    </Typography>
                                </TableCell>

                                <TableCell align="right">
                                    <Typography variant={'caption'} className={classes.tableHeadLabel}>
                                        Amount
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ backgroundColor: '#fff' }}>
                            {commissions?.data.map((item, index) => {
                                return (
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={index}>
                                        <TableCell component="th" scope="row">
                                            <Typography className={classes.tableRowLabel}>
                                                {moment(item.createdAt).format('MM/DD/YYYY')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography className={classes.tableRowLabel} sx={{ fontWeight: '400' }}>
                                                {item.addedBy.fullName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Avatar
                                                variant={'square'}
                                                sx={{ height: '48px', width: '35px' }}
                                                src={item.fileUrl ?? ''}
                                            ></Avatar>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography className={classes.tableRowLabel}>{item.notes}</Typography>
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
                                <TablePagination {...commissions?.paginationProps} />
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            </TableContainer>
        </>
    );
}

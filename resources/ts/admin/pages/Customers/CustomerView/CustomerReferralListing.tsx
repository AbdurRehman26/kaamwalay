import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { PayoutStatusEnum } from '@shared/constants/PayoutStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { payReferralCommissions } from '@shared/redux/slices/adminReferralPayoutSlice';
import { useAppDispatch } from '@admin/redux/hooks';

interface CustomerReferralListingProps {
    customers?: CustomerEntity[];
    payouts?: PayoutEntity[];
    paginationProp?: any;
    headings: Array<any>;
    orderDirection?: TableSortType;
    orderBy?: string;
    handleRequestSort?: any | null;
    isSignUp?: boolean;
    isPayout?: boolean;
}

export function CustomerReferralListing({
    customers,
    payouts,
    paginationProp,
    headings,
    orderBy = '',
    orderDirection = 'desc',
    handleRequestSort,
    isSignUp,
    isPayout,
}: CustomerReferralListingProps) {
    const dispatch = useAppDispatch();

    const handlePayCommission = async (payoutId: number) => {
        await dispatch(payReferralCommissions({ items: [payoutId] }));
    };

    return (
        <Table>
            <EnhancedTableHead
                onRequestSort={handleRequestSort}
                order={orderDirection}
                orderBy={orderBy}
                headCells={headings}
                hasStyling={true}
            />
            <TableBody sx={{ background: '#FFFFFF' }}>
                {isPayout ? (
                    <>
                        {payouts?.length > 0 ? (
                            payouts?.map((payout) => (
                                <TableRow>
                                    <TableCell>
                                        {`${formatDate(payout.createdAt, 'MMM D, YYYY')} at ${formatDate(
                                            payout.createdAt,
                                            'h:mm:s A',
                                        )}`}
                                    </TableCell>
                                    <TableCell>
                                        {`${formatDate(payout.completedAt, 'MMM D, YYYY')} at ${formatDate(
                                            payout.completedAt,
                                            'h:mm:s A',
                                        )}`}
                                    </TableCell>
                                    <TableCell>{payout.payoutAccount}</TableCell>
                                    <TableCell>{payout.status.name}</TableCell>
                                    <TableCell>{payout.paidBy.getFullName()}</TableCell>
                                    <TableCell>{payout.amount}</TableCell>
                                    <TableCell>
                                        {payout.status.id === PayoutStatusEnum.PENDING ? (
                                            <Button
                                                variant={'contained'}
                                                onClick={() => handlePayCommission(payout.id)}
                                            >
                                                Pay
                                            </Button>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell align={'center'} colSpan={9}>
                                    <Box padding={2}>
                                        <Typography variant={'subtitle2'}>
                                            We couldn't found any payouts yet.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}{' '}
                    </>
                ) : (
                    <>
                        {customers?.length > 0 ? (
                            customers?.map((customer) => (
                                <TableRow>
                                    <TableCell>
                                        <Grid container>
                                            <Avatar src={customer.profileImage ?? ''}>{customer.getInitials()}</Avatar>
                                            <Grid
                                                item
                                                xs
                                                container
                                                justifyContent={'center'}
                                                direction={'column'}
                                                pl={2}
                                            >
                                                <Typography variant={'body2'}>{customer.fullName}</Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell>
                                        {isSignUp && customer.signedUpAt
                                            ? formatDate(customer.signedUpAt, 'MM/DD/YYYY')
                                            : formatDate(customer.paidAt, 'MM/DD/YYYY')}
                                    </TableCell>
                                    <TableCell>{isSignUp ? customer.cardsCount : customer.cards}</TableCell>
                                    <TableCell>
                                        {isSignUp ? customer.submissions : formatCurrency(customer.submissionTotal)}
                                    </TableCell>
                                    {isSignUp ? <TableCell>{formatCurrency(customer.totalSpent)}</TableCell> : null}
                                    <TableCell sx={{ color: '#20BFB8', fontWeight: '700', fontSize: '14px' }}>
                                        {isSignUp
                                            ? formatCurrency(customer.totalCommissions)
                                            : formatCurrency(customer.commission)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell align={'center'} colSpan={9}>
                                    <Box padding={2}>
                                        <Typography variant={'subtitle2'}>
                                            We couldn't found any commission earnings yet.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </>
                )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination {...paginationProp} />
                </TableRow>
            </TableFooter>
        </Table>
    );
}

export default CustomerReferralListing;

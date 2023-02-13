import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
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
import { TableSortType } from '@shared/constants/TableSortType';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';

interface CustomerReferralListingProps {
    customers: CustomerEntity[];
    paginationProp?: any;
    headings: Array<any>;
    orderDirection?: TableSortType;
    orderBy?: string;
    handleRequestSort?: any | null;
    isSignUp?: boolean;
}

export function CustomerReferralListing({
    customers,
    paginationProp,
    headings,
    orderBy = '',
    orderDirection = 'desc',
    handleRequestSort,
    isSignUp,
}: CustomerReferralListingProps) {
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
                {customers?.length > 0 ? (
                    customers.map((customer) => (
                        <TableRow>
                            <TableCell>
                                <Grid container>
                                    <Avatar src={customer.profileImage ?? ''}>{customer.getInitials()}</Avatar>
                                    <Grid item xs container justifyContent={'center'} direction={'column'} pl={2}>
                                        <Typography variant={'body2'}>{customer.fullName}</Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>
                                {isSignUp && customer?.signedUpAt
                                    ? formatDate(customer?.signedUpAt, 'MM/DD/YYYY')
                                    : formatDate(customer?.paidAt, 'MM/DD/YYYY')}
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

import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import { TablePagination } from '@shared/components/TablePagination';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { TableSortType } from '@shared/constants/TableSortType';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { font } from '@shared/styles/utils';

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
            />
            <TableBody>
                {customers?.length > 0 ? (
                    customers.map((customer) => (
                        <TableRow>
                            <TableCell>
                                <MuiLink
                                    component={Link}
                                    color={'primary'}
                                    to={`/submissions/${customer.id}/view`}
                                    className={font.fontWeightMedium}
                                >
                                    {customer.fullName}
                                </MuiLink>
                            </TableCell>
                            <TableCell>
                                {customer.createdAt ? formatDate(customer.createdAt, 'MM/DD/YYYY') : 'N/A'}
                            </TableCell>
                            <TableCell>{customer.cards}</TableCell>
                            <TableCell>{customer.submissionTotal}</TableCell>
                            {isSignUp ? <TableCell>{customer.totalSpent}</TableCell> : null}
                            <TableCell>{customer.commission}</TableCell>
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

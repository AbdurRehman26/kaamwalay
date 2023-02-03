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
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { font } from '@shared/styles/utils';

interface CustomerReferralListingProps {
    tabFilter?: OrderStatusEnum;
    orders: OrderEntity[];
    paginationProp?: any;
    isCustomerDetailPage?: boolean;
    headings: Array<any>;
    orderDirection?: TableSortType;
    orderBy?: string;
    handleRequestSort?: any | null;
    isSignUp?: boolean;
}

export function CustomerReferralListing({
    tabFilter,
    orders,
    paginationProp,
    isCustomerDetailPage,
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
                {orders?.length > 0 ? (
                    orders.map((order) => (
                        <TableRow>
                            <TableCell>
                                <MuiLink
                                    component={Link}
                                    color={'primary'}
                                    to={`/submissions/${order.id}/view`}
                                    className={font.fontWeightMedium}
                                >
                                    {order.orderNumber}
                                </MuiLink>
                            </TableCell>
                            <TableCell>{order.createdAt ? formatDate(order.createdAt, 'MM/DD/YYYY') : 'N/A'}</TableCell>
                            <TableCell>{order.numberOfCards}</TableCell>
                            <TableCell>{order.grandTotal}</TableCell>
                            <TableCell>{order.grandTotal}</TableCell>
                            {isSignUp ? <TableCell>APAP</TableCell> : null}
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

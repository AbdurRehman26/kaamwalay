import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { OrderEntity } from '@shared/entities/OrderEntity';
import SubmissionsTableRow from '@admin/pages/Submissions/SubmissionsList/SubmissionsTableRow';

interface CustomerSubmissionsListProps {
    tabFilter?: OrderStatusEnum;
    orders: OrderEntity[];
    paginationProp?: any;
    isCustomerDetailPage?: boolean;
    displayCheckbox?: boolean;
    isReferralPage?: boolean;
    headings?: Array<any>;
    orderDirection?: TableSortType;
    orderBy?: string;
    handleRequestSort?: any | null;
    onEditCustomer?: any;
    showSubmissionActionButtons?: boolean;
}

export function CustomerSubmissionsList({
    tabFilter,
    orders,
    paginationProp,
    isCustomerDetailPage,
    displayCheckbox = false,
    isReferralPage = false,
    headings,
    orderBy = '',
    orderDirection = 'desc',
    handleRequestSort,
    onEditCustomer,
    showSubmissionActionButtons = true,
}: CustomerSubmissionsListProps) {
    return (
        <Table>
            {headings ? (
                <EnhancedTableHead
                    onRequestSort={handleRequestSort}
                    order={orderDirection}
                    orderBy={orderBy}
                    headCells={headings}
                />
            ) : (
                <TableHead>
                    <TableRow>
                        <TableCell variant={'head'}>Submission #</TableCell>
                        <TableCell variant={'head'}>{'Placed'}</TableCell>
                        {!isCustomerDetailPage && !isReferralPage ? (
                            <TableCell variant={'head'}>Reviewed</TableCell>
                        ) : null}
                        {!isCustomerDetailPage ? <TableCell variant={'head'}>Customer</TableCell> : null}
                        <TableCell variant={'head'}>Cards</TableCell>
                        <TableCell variant={'head'}>Status</TableCell>
                        <TableCell variant={'head'}>Payment</TableCell>
                        <TableCell variant={'head'}>Declared Value</TableCell>
                        {isReferralPage ? <TableCell variant={'head'}>Promo Code</TableCell> : null}
                        <TableCell variant={'head'}>Order Total</TableCell>
                        <TableCell variant={'head'} />
                        <TableCell variant={'head'} />
                    </TableRow>
                </TableHead>
            )}
            <TableBody>
                {orders?.length > 0 ? (
                    orders.map((order) => (
                        <SubmissionsTableRow
                            showSubmissionActionButtons={showSubmissionActionButtons}
                            order={order}
                            key={order.id}
                            displayCheckbox={displayCheckbox}
                            isCustomerDetailPage={!isCustomerDetailPage}
                            isReferralPage={isReferralPage}
                            onEditCustomer={onEditCustomer}
                        />
                    ))
                ) : (
                    <TableRow>
                        <TableCell align={'center'} colSpan={9}>
                            <Box padding={2}>
                                <Typography variant={'subtitle2'}>We couldn't found any orders yet.</Typography>
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

export default CustomerSubmissionsList;

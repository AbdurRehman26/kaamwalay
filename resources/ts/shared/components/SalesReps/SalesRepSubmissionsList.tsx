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

interface SalesRepSubmissionsListProps {
    tabFilter?: OrderStatusEnum;
    orders: OrderEntity[];
    paginationProp?: any;
    isSalesRepDetailPage?: boolean;
    headings?: Array<any>;
    orderDirection?: TableSortType;
    orderBy?: string;
    handleRequestSort?: any | null;
}

export function SalesRepSubmissionsList({
    tabFilter,
    orders,
    paginationProp,
    isSalesRepDetailPage,
    headings,
    orderBy = '',
    orderDirection = 'desc',
    handleRequestSort,
}: SalesRepSubmissionsListProps) {
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
                        <TableCell variant={'head'}>Date Created</TableCell>
                        <TableCell variant={'head'}>Cards</TableCell>
                        <TableCell variant={'head'}>Payment</TableCell>
                        <TableCell variant={'head'}>Status</TableCell>
                        <TableCell variant={'head'}>Declared Value</TableCell>
                        <TableCell variant={'head'}>Total</TableCell>
                        <TableCell variant={'head'}>Commission</TableCell>
                        <TableCell variant={'head'} />
                    </TableRow>
                </TableHead>
            )}
            <TableBody>
                {orders?.length > 0 ? (
                    orders.map((order) => (
                        <SubmissionsTableRow
                            order={order}
                            key={order.id}
                            isCustomerDetailPage={false}
                            isSalesRepDetailPage={false}
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

export default SalesRepSubmissionsList;

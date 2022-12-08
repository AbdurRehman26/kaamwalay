import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import SubmissionsTableRow from '@salesrep/pages/Submissions/SubmissionsList/SubmissionsTableRow';
import React from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { OrderEntity } from '@shared/entities/OrderEntity';

interface CustomerSubmissionsListProps {
    tabFilter?: OrderStatusEnum;
    orders: OrderEntity[];
    paginationProp?: any;
    headings: Array<any>;
    orderDirection?: TableSortType;
    orderBy?: string;
    handleRequestSort?: any | null;
}

export function CustomerSubmissionsList({
    orders,
    paginationProp,
    headings,
    orderBy = '',
    orderDirection = 'desc',
    handleRequestSort,
}: CustomerSubmissionsListProps) {
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
                    orders.map((order) => <SubmissionsTableRow order={order} key={order.id} />)
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

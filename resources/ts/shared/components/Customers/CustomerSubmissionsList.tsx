import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { TablePagination } from '@shared/components/TablePagination';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { OrderEntity } from '@shared/entities/OrderEntity';
import SubmissionsTableRow from '@admin/pages/Submissions/SubmissionsList/SubmissionsTableRow';

interface CustomerSubmissionsListProps {
    tabFilter?: OrderStatusEnum;
    orders: OrderEntity[];
    paginationProp?: any;
    isCustomerDetailPage?: boolean;
}

export function CustomerSubmissionsList({
    tabFilter,
    orders,
    paginationProp,
    isCustomerDetailPage,
}: CustomerSubmissionsListProps) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell variant={'head'}>Submission #</TableCell>
                    <TableCell variant={'head'}>
                        {tabFilter === OrderStatusEnum.INCOMPLETE ? 'Date Created' : 'Placed'}
                    </TableCell>
                    {!isCustomerDetailPage ? (
                        <>
                            <TableCell variant={'head'}>Reviewed</TableCell>
                            <TableCell variant={'head'}>Customer</TableCell>
                        </>
                    ) : null}
                    <TableCell variant={'head'}>Cards</TableCell>
                    <TableCell variant={'head'}>Status</TableCell>
                    <TableCell variant={'head'}>Payment</TableCell>
                    <TableCell variant={'head'}>Declared Value</TableCell>
                    <TableCell variant={'head'}>Order Total</TableCell>
                    <TableCell variant={'head'} />
                    <TableCell variant={'head'} />
                </TableRow>
            </TableHead>
            <TableBody>
                {orders?.length > 0 ? (
                    orders.map((order) => (
                        <SubmissionsTableRow
                            order={order}
                            key={order.id}
                            isCustomerDetailPage={!isCustomerDetailPage}
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

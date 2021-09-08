import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { TablePagination } from '@shared/components/TablePagination';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { SubmissionTableRow } from './SubmissionTableRow';
import { Table } from './styles';

export function SubmissionsTable() {
    const { isLoading, isError, data, paginationProps } = useListOrdersQuery();

    if (isLoading || isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {isLoading ? <CircularProgress /> : <Typography color={'error'}>Error loading submissions</Typography>}
            </Box>
        );
    }
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Submission #</TableCell>
                            <TableCell variant={'head'}>Date Placed</TableCell>
                            <TableCell variant={'head'}>Date Arrived</TableCell>
                            <TableCell variant={'head'}>Service Level</TableCell>
                            <TableCell variant={'head'}># Cards</TableCell>
                            <TableCell variant={'head'}>Status</TableCell>
                            <TableCell variant={'head'} />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.map((data: OrderEntity, index) => (
                            <SubmissionTableRow
                                disabled
                                key={index}
                                id={data.id}
                                orderNumber={data.orderNumber}
                                serviceLevel={data.paymentPlan.price}
                                cardsNumber={data.numberOfCards}
                                status={data.status}
                                datePlaced={data.createdAt}
                                dateArrived={data.arrivedAt}
                                invoice={data.invoice?.path}
                                invoiceNumber={data.invoice?.invoiceNumber}
                                customerShipment={data.customerShipment}
                            />
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination {...paginationProps} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}

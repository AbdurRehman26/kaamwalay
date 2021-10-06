import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { TablePagination } from '@shared/components/TablePagination';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { SubmissionTableRow } from './SubmissionTableRow';
import { Table } from './styles';

export function SubmissionsTable() {
    const { isLoading, isError, data, paginationProps } = useListOrdersQuery({
        params: {
            include: ['paymentPlan', 'invoice', 'orderStatus', 'orderCustomerShipment'],
        },
    });

    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

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
                    {!isMobile ? (
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
                    ) : null}

                    <TableBody>
                        {data.map((data: OrderEntity) => (
                            <SubmissionTableRow
                                disabled
                                key={data?.id}
                                id={data?.id}
                                orderNumber={data?.orderNumber}
                                serviceLevel={data?.paymentPlan?.price}
                                cardsNumber={data?.numberOfCards}
                                status={data?.orderStatus?.name}
                                datePlaced={data?.createdAt}
                                dateArrived={data?.arrivedAt}
                                invoice={data?.invoice?.path}
                                invoiceNumber={data?.invoice?.invoiceNumber}
                                orderCustomerShipment={data?.orderCustomerShipment}
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

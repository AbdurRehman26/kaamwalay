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
import { useEffect } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { SubmissionTableRow } from './SubmissionTableRow';
import { Table } from './styles';

interface SubmissionsTableProps {
    search?: string;
}

export function SubmissionsTable({ search }: SubmissionsTableProps) {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const orders$ = useListOrdersQuery({
        params: {
            filter: { search },
            include: ['paymentPlan', 'invoice', 'orderStatus', 'orderCustomerShipment'],
        },
        ...bracketParams(),
    });

    useEffect(
        () => {
            if (!orders$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                orders$.search({ search });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search],
    );

    if (orders$.isLoading || orders$.isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {orders$.isLoading ? (
                    <CircularProgress />
                ) : (
                    <Typography color={'error'}>Error loading submissions</Typography>
                )}
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
                        {orders$.data?.map((data: OrderEntity) => (
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
                            <TablePagination {...orders$.paginationProps} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}

import useMediaQuery from '@mui/material/useMediaQuery';
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
import { makeStyles } from '@mui/styles';

interface SubmissionsTableProps {
    search?: string;
}

const useStyles = makeStyles(
    (theme) => ({
        paginationFooter: {
            background: 'white',
            position: 'fixed',
            left: '72%',
            bottom: '0',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                left: '50%',
            },
        },
        tableMargin: {
            marginBottom: theme.spacing(7),
        },
    }),
    {
        name: 'SubmissionsTable',
    },
);

export function SubmissionsTable({ search }: SubmissionsTableProps) {
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const classes = useStyles();
    const orders$ = useListOrdersQuery({
        params: {
            filter: { orderNumber: search },
            include: ['paymentPlan', 'invoice', 'orderStatus', 'orderCustomerShipment'],
        },
        ...bracketParams(),
    });

    useEffect(
        () => {
            if (!orders$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                orders$.search({ orderNumber: search });
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

    const footer$ = (
        <TableFooter className={classes.paginationFooter}>
            <TableRow>
                <TablePagination {...orders$.paginationProps} />
            </TableRow>
        </TableFooter>
    );

    const items$ = orders$.data?.map((data: OrderEntity) => (
        <SubmissionTableRow
            disabled
            key={data?.id}
            id={data?.id}
            isSm={isSm}
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
    ));

    return (
        <>
            {isSm ? (
                <>
                    {items$}
                    <TableContainer className={classes.tableMargin}>
                        <Table>{footer$}</Table>
                    </TableContainer>
                </>
            ) : (
                <TableContainer className={classes.tableMargin}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell variant={'head'}>Submission #</TableCell>
                                <TableCell variant={'head'}>Date Placed</TableCell>
                                <TableCell variant={'head'}>Date Confirmed</TableCell>
                                <TableCell variant={'head'}>Service Level</TableCell>
                                <TableCell variant={'head'}># Cards</TableCell>
                                <TableCell variant={'head'}>Status</TableCell>
                                <TableCell variant={'head'} />
                            </TableRow>
                        </TableHead>

                        <TableBody>{items$}</TableBody>

                        {items$.length > 0 ? footer$ : null}
                    </Table>
                </TableContainer>
            )}
        </>
    );
}

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
import { styled, Theme } from '@mui/material/styles';
import { useEffect } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { SubmissionTableRow } from './SubmissionTableRow';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import { Table } from './styles';
import Grid from '@mui/material/Grid';

const StyledBox = styled(Box)(
    {
        width: '100%',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '40px 20px',
        marginTop: '15px',
    },
    { name: 'StyledBox' },
);

const PaginationFooter = styled('div')(() => ({
    backgroundColor: '#fff',
    position: 'sticky',
    bottom: 0,
}));

interface SubmissionsTableProps {
    search?: string;
}

export function SubmissionsTable({ search }: SubmissionsTableProps) {
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const orders$ = useListOrdersQuery({
        params: {
            filter: { orderNumber: search },
            include: ['paymentPlan', 'invoice', 'orderStatus', 'orderCustomerShipment'],
            perPage: 48,
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
        <PaginationFooter>
            <Table>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            {...{
                                ...orders$.paginationProps,
                                rowsPerPageOptions: [48],
                            }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </PaginationFooter>
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
            status={data?.orderStatus?.id}
            datePlaced={data?.createdAt}
            dateArrived={data?.arrivedAt}
            invoice={data?.invoice?.path}
            invoiceNumber={data?.invoice?.invoiceNumber}
            orderCustomerShipment={data?.orderCustomerShipment}
            paymentStatus={data?.paymentStatus}
        />
    ));

    if (items$.length === 0 && search === '') {
        return (
            <StyledBox>
                <Grid container alignItems={'center'} justifyContent={'center'} rowSpacing={1}>
                    <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                        <Inventory2TwoToneIcon />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'subtitle1'} fontWeight={500} textAlign={'center'} fontSize={16}>
                            No Submissions
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                            You have no submission's yet.
                            <br />
                            Click NEW SUBMISSION to get started.
                        </Typography>
                    </Grid>
                </Grid>
            </StyledBox>
        );
    }

    if (items$.length === 0 && search !== '') {
        return (
            <Typography variant={'subtitle2'} marginTop={'10px'}>
                We didn't find anything for "{search}". Try searching for something else
            </Typography>
        );
    }

    return (
        <Box mb={7} width={'100%'}>
            {isSm ? (
                <>
                    {items$}
                    <TableContainer>
                        <Table>{footer$}</Table>
                    </TableContainer>
                </>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell variant={'head'}>Submission #</TableCell>
                                    <TableCell variant={'head'}>Date Placed</TableCell>
                                    <TableCell variant={'head'}>Payment Status</TableCell>
                                    <TableCell variant={'head'}>Service Level</TableCell>
                                    <TableCell variant={'head'}># Cards</TableCell>
                                    <TableCell variant={'head'}>Status</TableCell>
                                    <TableCell variant={'head'} />
                                </TableRow>
                            </TableHead>

                            <TableBody>{items$}</TableBody>
                        </Table>
                    </TableContainer>
                    {orders$.pagination.meta.total > orders$.pagination.meta.perPage ? footer$ : null}
                </>
            )}
        </Box>
    );
}

import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { upperFirst } from 'lodash';
import React, { useMemo } from 'react';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListAdminOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import SubmissionsTableRow from '@admin/pages/Submissions/SubmissionsList/SubmissionsTableRow';

interface SubmissionsTableProps {
    tabFilter?: OrderStatusEnum;
    all?: boolean;
}

export function SubmissionsTable({ tabFilter, all }: SubmissionsTableProps) {
    const status = useMemo(() => OrderStatusMap[tabFilter || OrderStatusEnum.PAYMENT_PENDING], [tabFilter]);
    const heading = all ? 'All' : upperFirst(status?.label ?? '');

    const orders$ = useListAdminOrdersQuery({
        params: {
            filter: {
                status: all ? 'all' : tabFilter,
            },
            include: ['orderStatus', 'customer', 'invoice'],
        },
        ...bracketParams(),
    });

    const totals = orders$.pagination?.meta?.total ?? 0;

    if (orders$.isLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container direction={'column'}>
            <Box pt={2.5} px={2} pb={2}>
                <Typography variant={'h6'}>
                    {heading} {totals > 0 ? `(${totals})` : null}
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Submission #</TableCell>
                            <TableCell variant={'head'}>Placed</TableCell>
                            <TableCell variant={'head'}>Arrived</TableCell>
                            <TableCell variant={'head'}>Customer</TableCell>
                            <TableCell variant={'head'}>Cards</TableCell>
                            <TableCell variant={'head'}>Status</TableCell>
                            <TableCell variant={'head'}>Declared Value</TableCell>
                            <TableCell variant={'head'}>Amount Paid</TableCell>
                            <TableCell variant={'head'} />
                            <TableCell variant={'head'} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders$.data?.length > 0 ? (
                            orders$.data.map((order) => <SubmissionsTableRow order={order} key={order.id} />)
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
                </Table>
            </TableContainer>
        </Grid>
    );
}

export default SubmissionsTable;

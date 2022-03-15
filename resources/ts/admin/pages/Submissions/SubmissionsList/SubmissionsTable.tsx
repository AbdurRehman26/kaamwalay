import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListAdminOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import SubmissionsTableRow from '@admin/pages/Submissions/SubmissionsList/SubmissionsTableRow';
import Button from '@mui/material/Button';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { useRepository } from '@shared/hooks/useRepository';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';
import { useNotifications } from '@shared/hooks/useNotifications';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';

interface SubmissionsTableProps {
    tabFilter?: OrderStatusEnum;
    all?: boolean;
    search?: string;
}

export function SubmissionsTable({ tabFilter, all, search }: SubmissionsTableProps) {
    const status = useMemo(() => OrderStatusMap[tabFilter || OrderStatusEnum.INCOMPLETE], [tabFilter]);
    const heading = all ? 'All' : upperFirst(status?.label ?? '');

    const [isSearchEnabled, setIsSearchEnabled] = useState(false);

    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();

    const orders$ = useListAdminOrdersQuery({
        params: {
            include: ['orderStatus', 'customer', 'customer.wallet', 'invoice', 'orderShipment', 'orderLabel'],
            filter: {
                search,
                status: all ? 'all' : tabFilter,
            },
        },
        ...bracketParams(),
    });

    const totals = orders$.pagination?.meta?.total ?? 0;

    const handleExportData = useCallback(async () => {
        try {
            const exportData = await dataExportRepository.export({
                model: ExportableModelsEnum.Order,
                filter: {
                    search,
                    status: all ? 'all' : tabFilter,
                },
            });

            await downloadFromUrl(exportData.fileUrl, `robograding-submissions.xlsx`);
        } catch (e: any) {
            notifications.exception(e);
        }
    }, [dataExportRepository, search, all, tabFilter, notifications]);

    useEffect(
        () => {
            if (!orders$.isLoading && isSearchEnabled) {
                // noinspection JSIgnoredPromiseFromCall
                orders$.search(toApiPropertiesObject({ search }));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search, isSearchEnabled],
    );

    useEffect(() => {
        setIsSearchEnabled(true);
    }, []);

    if (orders$.isLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container direction={'column'}>
            <Grid container pt={2.5} px={2} pb={2} justifyContent={'flex-start'}>
                <Grid item xs container alignItems={'center'}>
                    <Typography variant={'h6'}>
                        {heading} {totals > 0 ? `(${totals})` : null}
                    </Typography>
                </Grid>
                <Grid item xs container justifyContent={'flex-end'} maxWidth={'240px !important'}>
                    <Button
                        variant={'outlined'}
                        color={'primary'}
                        sx={{ borderRadius: 20, padding: '7px 24px' }}
                        onClick={handleExportData}
                    >
                        Export List
                    </Button>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Submission #</TableCell>
                            <TableCell variant={'head'}>
                                {tabFilter === OrderStatusEnum.PAYMENT_PENDING ? 'Date Created' : 'Placed'}
                            </TableCell>
                            <TableCell variant={'head'}>Reviewed</TableCell>
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
                    <TableFooter>
                        <TableRow>
                            <TablePagination {...orders$.paginationProps} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Grid>
    );
}

export default SubmissionsTable;

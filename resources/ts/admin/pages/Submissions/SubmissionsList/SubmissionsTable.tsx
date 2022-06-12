import Check from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import { upperFirst } from 'lodash';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListAdminOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';
import SubmissionsTableRow from '@admin/pages/Submissions/SubmissionsList/SubmissionsTableRow';

interface SubmissionsTableProps {
    tabFilter?: OrderStatusEnum;
    all?: boolean;
    search?: string;
}

interface Props {
    label: string;
    active?: boolean;
    value?: string;
    onClear?: () => void;
}

const joinFilterValues = (values: any[], separator = ',') =>
    values
        .map((value) => `${value ?? ''}`.trim())
        .filter(Boolean)
        .join(separator);

const signedUpFilter = (start: DateLike, end: DateLike, separator = ',', format = 'YYYY-MM-DD') =>
    joinFilterValues([formatDate(start, format), formatDate(end, format)], separator);

const submissionsFilter = (min: number | string, max: number | string, separator = ',') =>
    joinFilterValues([min, max], separator);

const getFilters = (values) => ({
    search: values.search,
    signedUpBetween: signedUpFilter(values.signedUpStart, values.signedUpEnd),
    submissions: submissionsFilter(values.minSubmissions, values.maxSubmissions),
});

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 20,
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: 400,
    margin: theme.spacing(0, 1),
    padding: '7px 14px',
    borderColor: '#e0e0e0',
    '.MuiSvgIcon-root': {
        color: 'rgba(0, 0, 0, .54)',
    },
    '&.hasValue': {
        '&, .MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
    },
    '&:hover, &.active,&.hasValue': {
        backgroundColor: 'transparent',
        borderColor: theme.palette.primary.main,
    },
}));

export function SubmissionsTable({ tabFilter, all, search }: SubmissionsTableProps) {
    const status = useMemo(() => OrderStatusMap[tabFilter || OrderStatusEnum.INCOMPLETE], [tabFilter]);
    const heading = all ? 'All' : upperFirst(status?.label ?? '');
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);

    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();

    const filterButton = ({ label, active, value, onClear, children }: PropsWithChildren<Props>) => {
        return (
            <StyledButton
                variant={'outlined'}
                color={'inherit'}
                endIcon={value ? <Check onClick={handleClearSubmissions} /> : null}
                onClick={handleApplyFilter}
                className={classNames({ active: active, hasValue: !!value })}
            >
                {label}
                {value ? <>: &nbsp;{value}</> : null}
            </StyledButton>
        );
    };
    console.log(filterButton);
    const orders$ = useListAdminOrdersQuery({
        params: {
            include: [
                'orderStatus',
                'customer',
                'customer.wallet',
                'invoice',
                'orderShipment',
                'orderLabel',
                'shippingMethod',
            ],
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

    const handleClearSubmissions = useCallback(async () => {
        await orders$.search(
            getFilters({
                minSubmissions: '',
                maxSubmissions: '',
            }),
        );
    }, [orders$]);

    const handleApplyFilter = useCallback(
        async (values) => {
            await orders$.search(getFilters(values));

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [orders$],
    );

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
            <Grid alignItems={'left'}></Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Submission #</TableCell>
                            <TableCell variant={'head'}>
                                {tabFilter === OrderStatusEnum.INCOMPLETE ? 'Date Created' : 'Placed'}
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

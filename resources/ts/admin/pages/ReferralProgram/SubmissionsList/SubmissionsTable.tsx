import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { Formik, FormikProps } from 'formik';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CustomerSubmissionsList from '@shared/components/Customers/CustomerSubmissionsList';
import { PageSelector } from '@shared/components/PageSelector';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListAdminReferralOrdersQuery } from '@shared/redux/hooks/useReferralOrdersQuery';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';

interface SubmissionsTableProps {
    tabFilter?: OrderStatusEnum;
    all?: boolean;
    search?: string;
}

type InitialValues = {
    paymentStatus?: string;
};

const PaymentStatusOptions = [
    { label: 'Pending', value: '0' },
    { label: 'Payment Due', value: '1' },
    { label: 'Paid', value: '2' },
];

const getFilters = (values: InitialValues) => ({
    paymentStatus: values.paymentStatus,
});

export function SubmissionsTable({ tabFilter, all, search }: SubmissionsTableProps) {
    const status = useMemo(() => OrderStatusMap[tabFilter ? tabFilter : OrderStatusEnum.PLACED], [tabFilter]);
    const heading = all ? 'All' : upperFirst(status?.label ?? '');
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);

    const [orderDirection, setOrderDirection] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('orders.created_at');
    const [sortFilter, setSortFilter] = useState('-orders.created_at');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState({
        label: '',
        value: '',
    });
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery }] = useLocationQuery<InitialValues>();

    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();

    const headings: EnhancedTableHeadCell[] = [
        {
            id: 'order_number',
            numeric: false,
            disablePadding: false,
            label: 'Submission #',
            align: 'left',
            sortable: true,
        },
        {
            id: 'orders.created_at',
            numeric: false,
            disablePadding: false,
            label: 'Placed',
            align: 'left',
            sortable: true,
        },
        {
            id: 'customer_number',
            numeric: false,
            disablePadding: false,
            label: 'Customer',
            align: 'left',
            sortable: true,
        },
        {
            id: 'owner',
            numeric: false,
            disablePadding: false,
            label: 'Owner',
            align: 'left',
            sortable: true,
        },
        {
            id: 'referrer',
            numeric: false,
            disablePadding: false,
            label: 'Referrer',
            align: 'left',
            sortable: true,
        },
        {
            id: 'cards',
            numeric: true,
            disablePadding: false,
            label: 'Cards',
            align: 'left',
            sortable: true,
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Status',
            align: 'left',
            sortable: true,
        },
        {
            id: 'payment_status',
            numeric: false,
            disablePadding: false,
            label: 'Payment',
            align: 'left',
            sortable: true,
        },
        {
            id: 'total_declared_value',
            numeric: true,
            disablePadding: false,
            label: 'Declared Value',
            align: 'left',
            sortable: true,
        },
        {
            id: 'promo_code',
            numeric: true,
            disablePadding: false,
            label: 'Promo Code',
            align: 'left',
            sortable: false,
        },
        {
            id: 'grand_total',
            numeric: true,
            disablePadding: false,
            label: 'Order Total',
            align: 'left',
            sortable: true,
        },
        {
            id: 'options',
            numeric: false,
            disablePadding: false,
            label: '',
            align: 'left',
            sortable: false,
        },
    ];

    const initialValues = useMemo<InitialValues>(
        () => ({
            paymentStatus: query.paymentStatus ?? '',
        }),
        [query.paymentStatus],
    );

    const orders$ = useListAdminReferralOrdersQuery({
        params: {
            include: ['orderStatus', 'customer', 'invoice', 'coupon'],
            sort: sortFilter,
            filter: {
                search,
                status: all ? 'all' : tabFilter,
                paymentStatus: paymentStatusFilter.value,
            },
        },
        ...bracketParams(),
    });

    const totals = orders$.pagination?.meta?.total ?? 0;

    const handleExportData = useCallback(async () => {
        try {
            const exportData = await dataExportRepository.export({
                model: ExportableModelsEnum.Order,
                sort: { sort: sortFilter },
                filter: {
                    search,
                    status: all ? 'all' : tabFilter,
                    paymentStatus: paymentStatusFilter.value,
                },
            });

            await downloadFromUrl(exportData.fileUrl, `robograding-submissions.xlsx`);
        } catch (e: any) {
            notifications.exception(e);
        }
    }, [dataExportRepository, sortFilter, search, all, tabFilter, paymentStatusFilter.value, notifications]);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSubmit = useCallback(
        async (values) => {
            setQuery({
                ...values,
            });

            await orders$.searchSortedWithPagination({ sort: sortFilter }, getFilters(values), 1);

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [orders$, setQuery, sortFilter],
    );
    const handleClearPaymentStatus = useCallback(async () => {
        formikRef.current?.setFieldValue('paymentStatus', '');
        delQuery('paymentStatus');
        setPaymentStatusFilter({ value: '', label: '' });
        await orders$.searchSortedWithPagination(
            { sort: sortFilter },
            getFilters({
                ...formikRef.current!.values,
                paymentStatus: '',
            }),
            1,
        );
    }, [delQuery, orders$, sortFilter]);

    const handlePaymentStatus = useCallback(
        async (values, status) => {
            values = {
                ...values,
                paymentStatus: status.value,
            };
            setPaymentStatusFilter({
                value: status.value,
                label: status.label,
            });
            await handleSubmit(values);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [handleSubmit],
    );
    useEffect(
        () => {
            if (!orders$.isLoading && isSearchEnabled) {
                // noinspection JSIgnoredPromiseFromCall
                orders$.searchSortedWithPagination(
                    { sort: sortFilter },
                    toApiPropertiesObject({
                        search,
                        paymentStatus: paymentStatusFilter.value,
                    }),
                    1,
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search, isSearchEnabled, sortFilter],
    );

    useEffect(() => {
        setIsSearchEnabled(true);

        const paymentStatus = PaymentStatusOptions?.filter((item) => item.value === query.paymentStatus);
        setPaymentStatusFilter({ value: paymentStatus[0]?.value, label: paymentStatus[0]?.label });
    }, [query.paymentStatus]);

    useEffect(() => {
        setSortFilter((orderDirection === 'desc' ? '-' : '') + orderBy);
    }, [orderDirection, orderBy]);

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
                <Formik initialValues={initialValues} onSubmit={handleSubmit} innerRef={formikRef}>
                    {({ values }) => (
                        <>
                            <Grid item xs container alignItems={'left'}>
                                <Typography variant={'h6'} mr={2}>
                                    {heading} {totals > 0 ? `(${totals})` : null}
                                </Typography>
                                <PageSelector
                                    label={'Payment Status'}
                                    value={paymentStatusFilter.label}
                                    onClear={handleClearPaymentStatus}
                                >
                                    {PaymentStatusOptions?.map((item: any) => {
                                        return (
                                            <Grid key={item.value}>
                                                <MenuItem
                                                    onClick={() => handlePaymentStatus(values, item)}
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            </Grid>
                                        );
                                    })}
                                </PageSelector>
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
                        </>
                    )}
                </Formik>
            </Grid>

            <TableContainer>
                <CustomerSubmissionsList
                    orders={orders$.data}
                    paginationProp={orders$.paginationProps}
                    headings={headings}
                    handleRequestSort={handleRequestSort}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    isReferralPage={true}
                />
            </TableContainer>
        </Grid>
    );
}

export default SubmissionsTable;

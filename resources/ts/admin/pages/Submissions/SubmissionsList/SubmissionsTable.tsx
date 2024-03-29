import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { debounce, upperFirst } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CustomerSubmissionsList from '@shared/components/Customers/CustomerSubmissionsList';
import EditCustomerDetailsDialog from '@shared/components/EditCustomerDetailsDialog';
import { PageSelector } from '@shared/components/PageSelector';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { useAppSelector } from '@shared/hooks/useAppSelector';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useAdminOrdersListQuery } from '@shared/redux/hooks/useAdminOrdersListQuery';
import { getPromoCodes } from '@shared/redux/slices/adminPromoCodesSlice';
import { setSubmissionIds } from '@shared/redux/slices/submissionSelection';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';
import MarkAbandonedStateDialog from '@admin/pages/Submissions/SubmissionsView/MarkAbandonedStateDialog';
import { useAppDispatch } from '@admin/redux/hooks';

interface SubmissionsTableProps {
    tabFilter?: OrderStatusEnum;
    all?: boolean;
    search?: string;
    abandoned?: boolean;
}

const ReferralStatus = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 },
];

export function SubmissionsTable({ tabFilter, all, search, abandoned }: SubmissionsTableProps) {
    const status = useMemo(() => OrderStatusMap[tabFilter ? tabFilter : OrderStatusEnum.PLACED], [tabFilter]);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentStatusLabel, setPaymentStatusLabel] = useState('');
    const heading = abandoned ? 'Abandoned' : all ? 'All' : upperFirst(status?.label ?? '');
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [searchPromoCode, setSearchPromoCode] = useState('');
    const [promoCodes, setPromoCodes] = useState<PromoCodeEntity[]>([]);
    const [couponCode, setCouponCode] = useState<PromoCodeEntity | null>(null);
    const [referrerStatus, setReferrerStatus] = useState({ label: '', value: '' });

    const [orderDirection, setOrderDirection] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState('-created_at');

    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();
    const dispatch = useAppDispatch();
    const [editCustomerDialog, setEditCustomerDialog] = useState(false);
    const customer = useAppSelector((state) => state.editCustomerSlice.customer);
    const [allSelected, setAllSelected] = useState(false);
    const selectedIds = useAppSelector((state) => state.submissionSelection.selectedIds);
    const [showMarkAbandonedDialog, setShowMarkAbandonedDialog] = useState(false);

    useEffect(() => {
        dispatch(setSubmissionIds({ ids: [] }));
        setAllSelected(false);
    }, [dispatch]);

    const handleSelectAll = () => {
        if (!allSelected) {
            let orderQuery = orders$.data;
            if (!abandoned) {
                orderQuery = orderQuery.filter((order) => order.paymentStatus !== PaymentStatusEnum.PAID);
            }
            const newSelected = orderQuery.map((order) => order.id);
            dispatch(setSubmissionIds({ ids: newSelected }));
            setAllSelected(true);
            return;
        }
        dispatch(setSubmissionIds({ ids: [] }));
        setAllSelected(false);
    };

    const headings: EnhancedTableHeadCell[] = [
        {
            id: 'order_number',
            numeric: false,
            disablePadding: false,
            label: 'Submission #',
            align: 'left',
            sortable: true,
            component: (
                <Checkbox
                    color="primary"
                    checked={allSelected}
                    indeterminate={selectedIds.length > 0}
                    onClick={handleSelectAll}
                />
            ),
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: false,
            label: 'Placed',
            align: 'left',
            sortable: true,
        },
        {
            id: 'arrived_at',
            numeric: false,
            disablePadding: false,
            label: 'Reviewed',
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
            sortable: false,
        },
        {
            id: 'referred_by',
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
            id: 'coupon',
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
            id: 'buttons',
            numeric: false,
            disablePadding: false,
            label: '',
            align: 'left',
            sortable: false,
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

    const orders$ = useAdminOrdersListQuery({
        params: {
            include: [
                'orderStatus',
                'customer.wallet',
                'customer.referredBy',
                'invoice',
                'orderShipment',
                'orderLabel',
                'shippingMethod',
                'coupon',
                'owner',
                'tags',
            ],
            sort: sortFilter,
            filter: {
                search,
                status: all ? 'all' : tabFilter,
                paymentStatus,
                couponCode: couponCode?.code,
                tags: abandoned ? 'abandoned' : -1,
            },
        },
        ...bracketParams(),
    });

    const debouncedFunc = debounce((func: any) => {
        func();
    }, 300);

    const totals = orders$.pagination?.meta?.total ?? 0;

    const clearPromoCode = useCallback(() => {
        setCouponCode(null);
        orders$.searchSortedWithPagination(
            { sort: sortFilter },
            toApiPropertiesObject({
                search,
                paymentStatus: paymentStatus,
                couponCode: '',
                referredBy: referrerStatus.value,
            }),
            1,
        );
    }, [orders$, paymentStatus, search, sortFilter, referrerStatus]);

    const handlePromoCodeSearch = useCallback(
        (event: any) => {
            debouncedFunc(async () => {
                setSearchPromoCode(event.target.value);
                const result = await dispatch(getPromoCodes(event.target.value));
                await setPromoCodes(
                    result.payload.data.map((item: PromoCodeEntity) => {
                        return {
                            id: item?.id,
                            code: item?.code,
                        };
                    }),
                );
            });
        },
        [dispatch, debouncedFunc],
    );

    const clearPaymentStatus = useCallback(() => {
        setPaymentStatus(null);
        setPaymentStatusLabel('');
        orders$.searchSortedWithPagination(
            { sort: sortFilter },
            toApiPropertiesObject({
                search,
                paymentStatus: null,
                couponCode: couponCode?.code,
                referredBy: referrerStatus.value,
            }),
            1,
        );
    }, [orders$, sortFilter, search, couponCode, referrerStatus]);

    const handleExportData = useCallback(async () => {
        try {
            const exportData = await dataExportRepository.export({
                model: ExportableModelsEnum.Order,
                sort: { sort: sortFilter },
                filter: {
                    search,
                    status: all ? 'all' : tabFilter,
                    paymentStatus,
                    couponCode: couponCode?.code,
                    referredBy: referrerStatus.value,
                    tags: abandoned ? 'abandoned' : -1,
                },
            });

            await downloadFromUrl(exportData.fileUrl, `robograding-submissions.xlsx`);
        } catch (e: any) {
            notifications.exception(e);
        }
    }, [
        paymentStatus,
        dataExportRepository,
        search,
        all,
        tabFilter,
        notifications,
        sortFilter,
        couponCode,
        referrerStatus,
        abandoned,
    ]);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleApplyFilter = useCallback(
        async (selectedPaymentStatus, selectedPaymentStatusLabel) => {
            if (selectedPaymentStatus === paymentStatus) {
                setPaymentStatus(null);
                setPaymentStatusLabel('');
            } else {
                setPaymentStatus(selectedPaymentStatus);
                setPaymentStatusLabel(selectedPaymentStatusLabel);
            }

            orders$.searchSortedWithPagination(
                { sort: sortFilter },
                toApiPropertiesObject({
                    search,
                    paymentStatus: selectedPaymentStatus === paymentStatus ? null : selectedPaymentStatus,
                    couponCode: couponCode?.code,
                    referredBy: referrerStatus.value,
                }),
                1,
            );
        },
        [orders$, search, paymentStatus, setPaymentStatus, sortFilter, couponCode, referrerStatus],
    );

    const handlePromoCodeFilter = useCallback(
        (e, promoCode) => {
            setCouponCode(promoCode);
            orders$.searchSortedWithPagination(
                { sort: sortFilter },
                toApiPropertiesObject({
                    search,
                    paymentStatus: paymentStatus,
                    couponCode: promoCode.code,
                    referredBy: referrerStatus.value,
                }),
                1,
            );
        },
        [orders$, search, paymentStatus, sortFilter, referrerStatus.value],
    );

    const handleClearReferrerStatus = useCallback(async () => {
        setReferrerStatus({ label: '', value: '' });
        orders$.searchSortedWithPagination(
            { sort: sortFilter },
            toApiPropertiesObject({
                search,
                paymentStatus,
                couponCode: couponCode?.code,
            }),
            1,
        );
    }, [orders$, search, paymentStatus, sortFilter, couponCode]);

    const handleReferrerStatus = useCallback(
        async (values) => {
            setReferrerStatus({ value: values.value, label: values.label });
            orders$.searchSortedWithPagination(
                { sort: sortFilter },
                toApiPropertiesObject({
                    search,
                    paymentStatus,
                    referredBy: values.value,
                    couponCode: couponCode?.code,
                }),
                1,
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search, paymentStatus, sortFilter, couponCode],
    );

    useEffect(
        () => {
            // noinspection JSIgnoredPromiseFromCall
            if (!orders$.isLoading && isSearchEnabled) {
                // noinspection JSIgnoredPromiseFromCall
                orders$.searchSortedWithPagination(
                    { sort: sortFilter },
                    toApiPropertiesObject({
                        search,
                        paymentStatus,
                        referredBy: referrerStatus.value,
                        couponCode: couponCode?.code,
                    }),
                    1,
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search, isSearchEnabled, sortFilter],
    );

    const handleEditCustomerOption = useCallback(() => {
        setEditCustomerDialog(true);
    }, []);

    const handleEditCustomerDialogClose = useCallback(() => {
        setEditCustomerDialog(false);
    }, []);

    const handleEditCustomerSubmit = useCallback(() => {
        setEditCustomerDialog(false);
        window.location.reload();
    }, []);

    useEffect(() => {
        setIsSearchEnabled(true);
    }, []);

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
        <Grid container direction={'column'} display={'inline-grid'}>
            <Grid container pt={2} px={2} pb={2} justifyContent={'flex-start'}>
                <Grid item xs container alignItems={'center'}>
                    <Typography variant={'h6'}>
                        {heading} {totals > 0 ? `(${totals})` : null}
                    </Typography>
                </Grid>
                <Grid item xs container alignItems={'center'} justifyContent={'flex-end'} maxWidth={'400px !important'}>
                    <Grid display={'flex'}>
                        {selectedIds.length > 0 ? (
                            <Button
                                style={{ marginRight: '12px', borderRadius: '25px' }}
                                variant={'contained'}
                                onClick={() => setShowMarkAbandonedDialog(true)}
                            >
                                {abandoned ? 'Unmark' : 'Mark'} Abandoned
                            </Button>
                        ) : null}
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
            </Grid>
            <Grid alignItems={'left'}>
                <PageSelector label={'Payment Status'} value={paymentStatusLabel} onClear={clearPaymentStatus}>
                    {Object.entries(PaymentStatusMap).map(([key, status]) => {
                        return (
                            <Grid key={key}>
                                <MenuItem
                                    sx={{ textTransform: 'capitalize' }}
                                    onClick={() => handleApplyFilter(key, status)}
                                    key={key}
                                    value={key}
                                >
                                    {status}
                                </MenuItem>
                            </Grid>
                        );
                    })}
                </PageSelector>
                <PageSelector label={'Referrer'} value={referrerStatus.label} onClear={handleClearReferrerStatus}>
                    {ReferralStatus?.map((item: any) => {
                        return (
                            <Grid key={item.value}>
                                <MenuItem
                                    onClick={() => handleReferrerStatus(item)}
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </MenuItem>
                            </Grid>
                        );
                    })}
                </PageSelector>
                <PageSelector label={'Coupon'} value={couponCode?.code} onClear={clearPromoCode}>
                    <FormControl sx={{ width: '300px' }}>
                        <Autocomplete
                            getOptionLabel={(promoCodes) => promoCodes.code || searchPromoCode}
                            value={couponCode}
                            onKeyDown={(e) => handlePromoCodeSearch(e)}
                            onChange={handlePromoCodeFilter}
                            options={promoCodes}
                            fullWidth
                            renderInput={(params) => <TextField {...params} placeholder={'Search promo code'} />}
                        />
                    </FormControl>
                </PageSelector>
            </Grid>
            <TableContainer>
                <CustomerSubmissionsList
                    displayCheckbox={true}
                    orders={orders$.data}
                    paginationProp={orders$.paginationProps}
                    headings={headings}
                    handleRequestSort={handleRequestSort}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    onEditCustomer={handleEditCustomerOption}
                />
            </TableContainer>
            <EditCustomerDetailsDialog
                endpointUrl={`admin/customer/${customer.id}`}
                endpointVersion={'v3'}
                open={editCustomerDialog}
                onSubmit={handleEditCustomerSubmit}
                onClose={handleEditCustomerDialogClose}
            />
            <MarkAbandonedStateDialog
                isAbandoned={!!abandoned}
                orderIds={selectedIds}
                onSubmit={() => window.location.reload()}
                open={showMarkAbandonedDialog}
                onClose={() => setShowMarkAbandonedDialog(false)}
            />
        </Grid>
    );
}

export default SubmissionsTable;

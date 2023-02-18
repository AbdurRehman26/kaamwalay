import Check from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import { upperFirst } from 'lodash';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import CustomerSubmissionsList from '@shared/components/Customers/CustomerSubmissionsList';
import { PageSelector } from '@shared/components/PageSelector';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useAdminOrdersListQuery } from '@shared/redux/hooks/useAdminOrdersListQuery';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';

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

const ReferralStatus = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 },
];

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
    '&.active': {
        '&, .MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
    },
}));

export function SubmissionsTable({ tabFilter, all, search }: SubmissionsTableProps) {
    const status = useMemo(() => OrderStatusMap[tabFilter ? tabFilter : OrderStatusEnum.PLACED], [tabFilter]);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const heading = all ? 'All' : upperFirst(status?.label ?? '');
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [referrerStatus, setReferrerStatus] = useState({ label: '', value: 0 });

    const [orderDirection, setOrderDirection] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState('-created_at');

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

    const FilterButton = ({ label, active, value }: PropsWithChildren<Props>) => {
        return (
            <StyledButton
                variant={'outlined'}
                color={'inherit'}
                startIcon={active ? <Check onClick={() => setPaymentStatus(null)} /> : null}
                onClick={() => handleApplyFilter(value)}
                className={classNames({ active: active })}
            >
                {label}
            </StyledButton>
        );
    };

    const orders$ = useAdminOrdersListQuery({
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
            sort: sortFilter,
            filter: {
                search,
                status: all ? 'all' : tabFilter,
                paymentStatus,
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
                    paymentStatus,
                },
            });

            await downloadFromUrl(exportData.fileUrl, `robograding-submissions.xlsx`);
        } catch (e: any) {
            notifications.exception(e);
        }
    }, [paymentStatus, dataExportRepository, search, all, tabFilter, notifications, sortFilter]);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleApplyFilter = useCallback(
        async (selectedPaymentStatus) => {
            if (selectedPaymentStatus === paymentStatus) {
                setPaymentStatus(null);
            } else {
                setPaymentStatus(selectedPaymentStatus);
            }

            orders$.searchSortedWithPagination(
                { sort: sortFilter },
                toApiPropertiesObject({
                    search,
                    paymentStatus: selectedPaymentStatus === paymentStatus ? null : selectedPaymentStatus,
                    referredBy: referrerStatus.value,
                }),
                1,
            );
        },
        [orders$, search, paymentStatus, setPaymentStatus, sortFilter, referrerStatus.value],
    );

    const handleClearReferrerStatus = useCallback(async () => {
        setReferrerStatus({ label: '', value: 0 });
        orders$.searchSortedWithPagination(
            { sort: sortFilter },
            toApiPropertiesObject({
                search,
                paymentStatus,
            }),
            1,
        );
    }, [orders$, search, paymentStatus, sortFilter]);

    const handleReferrerStatus = useCallback(
        async (values) => {
            setReferrerStatus({ value: values.value, label: values.label });
            orders$.searchSortedWithPagination(
                { sort: sortFilter },
                toApiPropertiesObject({
                    search,
                    paymentStatus,
                    referredBy: values.value,
                }),
                1,
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [search, paymentStatus, sortFilter],
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
            <Grid alignItems={'left'}>
                {Object.entries(PaymentStatusMap).map(([key, status]) => {
                    return <FilterButton label={status} active={paymentStatus === key} value={key} />;
                })}
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
            </Grid>
            <TableContainer>
                <CustomerSubmissionsList
                    orders={orders$.data}
                    paginationProp={orders$.paginationProps}
                    headings={headings}
                    handleRequestSort={handleRequestSort}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                />
            </TableContainer>
        </Grid>
    );
}

export default SubmissionsTable;

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CustomerSubmissionsList from '@salesrep/components/Customers/CustomerSubmissionsList';
import { useAppDispatch } from '@salesrep/redux/hooks';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageSelector } from '@shared/components/PageSelector';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListSalesRepOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { getPromoCodes } from '@shared/redux/slices/salesmanPromoCodesSlice';

interface SubmissionsTableProps {
    tabFilter?: OrderStatusEnum;
    all?: boolean;
    search?: string;
}

export function SubmissionsTable({ tabFilter, all, search }: SubmissionsTableProps) {
    const status = useMemo(() => OrderStatusMap[tabFilter || OrderStatusEnum.PLACED], [tabFilter]);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentStatusLabel, setPaymentStatusLabel] = useState('');
    const [searchPromoCode, setSearchPromoCode] = useState('');
    const heading = all ? 'All' : upperFirst(status?.label ?? '');
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [promoCodes, setPromoCodes] = useState<PromoCodeEntity[]>([]);
    const [promoCode, setPromoCode] = useState<PromoCodeEntity | null>(null);
    const dispatch = useAppDispatch();

    const [orderDirection, setOrderDirection] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState('-created_at');

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
            label: 'Date Created',
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
            id: 'commission',
            numeric: true,
            disablePadding: false,
            label: 'Commission',
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

    const orders$ = useListSalesRepOrdersQuery({
        params: {
            include: [
                'orderStatus',
                'customer',
                'customer.wallet',
                'invoice',
                'orderShipment',
                'orderLabel',
                'shippingMethod',
                'coupon',
            ],
            sort: sortFilter,
            filter: {
                search,
                status: all ? 'all' : tabFilter,
                paymentStatus,
                promoCode,
            },
        },
        ...bracketParams(),
    });

    const totals = orders$.pagination?.meta?.total ?? 0;

    const clearPromoCode = useCallback(() => {
        setPromoCode(null);
        orders$.searchSortedWithPagination(
            { sort: sortFilter },
            toApiPropertiesObject({
                search,
                paymentStatus: paymentStatus,
                promoCode: '',
            }),
            1,
        );
    }, [orders$, paymentStatus, search, sortFilter]);

    const handlePromoCodeSearch = useCallback(
        (event: any) => {
            setSearchPromoCode(event.target.value);
            setTimeout(async () => {
                const result = await dispatch(getPromoCodes(event.target.value));
                await setPromoCodes(
                    result.payload.data.map((item: PromoCodeEntity) => {
                        return {
                            id: item?.id,
                            code: item?.code,
                        };
                    }),
                );
            }, 1500);
        },
        [dispatch],
    );

    const clearPaymentStatus = useCallback(() => {
        setPaymentStatus(null);
        setPaymentStatusLabel('');
        orders$.searchSortedWithPagination(
            { sort: sortFilter },
            toApiPropertiesObject({
                search,
                paymentStatus: null,
                promoCode,
            }),
            1,
        );
    }, [orders$, sortFilter, search, promoCode]);

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
                    promoCode,
                }),
                1,
            );
        },
        [orders$, search, paymentStatus, setPaymentStatus, sortFilter, promoCode],
    );

    const handlePromoCodeFilter = useCallback(
        (e, promoCode) => {
            setPromoCode(promoCode);
            orders$.searchSortedWithPagination(
                { sort: sortFilter },
                toApiPropertiesObject({
                    search,
                    paymentStatus: paymentStatus,
                    promoCode: promoCode.code,
                }),
                1,
            );
        },
        [orders$, paymentStatus, sortFilter, search],
    );

    useEffect(
        () => {
            if (!orders$.isLoading && isSearchEnabled) {
                // noinspection JSIgnoredPromiseFromCall
                orders$.searchSortedWithPagination(
                    { sort: sortFilter },
                    toApiPropertiesObject({
                        search,
                        paymentStatus,
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
                <PageSelector label={'Coupon'} value={promoCode?.code} onClear={clearPromoCode}>
                    <FormControl sx={{ width: '300px' }}>
                        <Autocomplete
                            getOptionLabel={(promoCodes) => promoCodes.code || searchPromoCode}
                            value={promoCode}
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

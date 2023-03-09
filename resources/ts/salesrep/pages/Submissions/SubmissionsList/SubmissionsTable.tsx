import Check from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CustomerSubmissionsList from '@salesrep/components/Customers/CustomerSubmissionsList';
import classNames from 'classnames';
import { upperFirst } from 'lodash';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import EditCustomerDetailsDialog from '@shared/components/EditCustomerDetailsDialog';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { OrderStatusEnum, OrderStatusMap } from '@shared/constants/OrderStatusEnum';
import { PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { useAppSelector } from '@shared/hooks/useAppSelector';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListSalesRepOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';

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
    const status = useMemo(() => OrderStatusMap[tabFilter || OrderStatusEnum.PLACED], [tabFilter]);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const heading = all ? 'All' : upperFirst(status?.label ?? '');
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);

    const [orderDirection, setOrderDirection] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState('-created_at');

    const [editCustomerDialog, setEditCustomerDialog] = useState(false);
    const customer = useAppSelector((state) => state.editCustomerSlice.customer);

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
                }),
                1,
            );
        },
        [orders$, search, paymentStatus, setPaymentStatus, sortFilter],
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
        <Grid container direction={'column'}>
            <Grid container pt={2.5} px={2} pb={2} justifyContent={'flex-start'}>
                <Grid item xs container alignItems={'center'}>
                    <Typography variant={'h6'}>
                        {heading} {totals > 0 ? `(${totals})` : null}
                    </Typography>
                </Grid>
            </Grid>
            <Grid alignItems={'left'}>
                {Object.entries(PaymentStatusMap).map(([key, status]) => {
                    return <FilterButton label={status} active={paymentStatus === key} value={key} />;
                })}
            </Grid>
            <TableContainer>
                <CustomerSubmissionsList
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
                endpointUrl={`salesman/customer/${customer.id}`}
                endpointVersion={'v3'}
                open={editCustomerDialog}
                onSubmit={handleEditCustomerSubmit}
                onClose={handleEditCustomerDialogClose}
            />
        </Grid>
    );
}

export default SubmissionsTable;

import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { TableSortType } from '@shared/constants/TableSortType';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListAdminOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';
import { CustomerReferralListing } from './CustomerReferralListing';

const Root = styled(Grid)({
    '.CustomerSubmissionListingBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
    },
});

const headings: EnhancedTableHeadCell[] = [
    {
        id: 'customer',
        numeric: false,
        disablePadding: false,
        label: 'CUSTOMER',
        align: 'left',
        sortable: true,
    },
    {
        id: 'paid_at',
        numeric: false,
        disablePadding: false,
        label: 'DATE PAID',
        align: 'left',
        sortable: true,
    },
    {
        id: 'cards',
        numeric: true,
        disablePadding: false,
        label: 'CARDS',
        align: 'left',
        sortable: true,
    },
    {
        id: 'grand_total',
        numeric: true,
        disablePadding: false,
        label: 'SUBMISSION TOTAL',
        align: 'left',
        sortable: true,
    },
    {
        id: 'commission',
        numeric: false,
        disablePadding: false,
        label: 'COMMISSION',
        align: 'left',
        sortable: false,
    },
];

export function CustomerReferralCommissionEarnings() {
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [ordersCount, setOrdersCount] = useState(0);
    const { id } = useParams<'id'>();

    const [orderDirection, setOrderDirection] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState('-created_at');

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
            sort: sortFilter,
            filter: {
                customerId: id,
            },
        },
        ...bracketParams(),
    });

    useEffect(() => {
        if (!orders$.isLoading && isSearchEnabled) {
            // noinspection JSIgnoredPromiseFromCall
            orders$.searchSortedWithPagination({ sort: sortFilter }, toApiPropertiesObject({}), 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearchEnabled, sortFilter]);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        setSortFilter((orderDirection === 'desc' ? '-' : '') + orderBy);
    }, [orderDirection, orderBy]);

    useEffect(() => {
        setIsSearchEnabled(true);
    }, []);

    useEffect(() => {
        if (orders$.data.length !== 0) {
            setOrdersCount(orders$.data.length);
        }
    }, [orders$.isLoading, orders$.data.length]);

    return (
        <Root container>
            <Grid container item xs className={'CustomerSubmissionListingBox'}>
                {orders$.isLoading ? (
                    <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {orders$.data.length !== 0 || ordersCount !== 0 ? (
                            <>
                                <TableContainer>
                                    <CustomerReferralListing
                                        orders={orders$.data}
                                        paginationProp={orders$.paginationProps}
                                        isCustomerDetailPage={true}
                                        headings={headings}
                                        handleRequestSort={handleRequestSort}
                                        orderBy={orderBy}
                                        orderDirection={orderDirection}
                                    />
                                </TableContainer>
                            </>
                        ) : (
                            <Grid
                                container
                                alignItems={'center'}
                                justifyContent={'center'}
                                rowSpacing={1}
                                sx={{ padding: '40px 20px' }}
                            >
                                <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                                    <Inventory2TwoToneIcon />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant={'subtitle1'}
                                        fontWeight={500}
                                        textAlign={'center'}
                                        fontSize={16}
                                    >
                                        No Commission
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                                        This customer has no commission earnings, yet.
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </>
                )}
            </Grid>
        </Root>
    );
}

export default CustomerReferralCommissionEarnings;

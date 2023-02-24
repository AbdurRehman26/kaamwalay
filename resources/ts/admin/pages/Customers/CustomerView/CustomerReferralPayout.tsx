import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminReferralPayoutsQuery } from '@shared/redux/hooks/useAdminReferralPayoutsQuery';
import { CustomerPayoutListing } from './CustomerPayoutListing';

const Root = styled(Grid)({
    '.CustomerReferralPayoutBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
    },
    '.TableTitle': {
        fontSize: '16px',
        lineHeight: '24px',
        color: 'rgba(0, 0, 0, 0.87)',
        marginTop: '16px',
        fontWeight: '400 !important',
    },
    '.ContainerBackground': {
        background: '#F9F9F9',
    },
    '.HeadingText': {
        color: '#0000008A',
    },
});

const headings: EnhancedTableHeadCell[] = [
    {
        id: 'created_at',
        numeric: false,
        disablePadding: false,
        label: 'DATE INITIATED',
        align: 'left',
        sortable: true,
    },
    {
        id: 'completed_at',
        numeric: false,
        disablePadding: false,
        label: 'DATE COMPLETED',
        align: 'left',
        sortable: false,
    },
    {
        id: 'payout_account',
        numeric: true,
        disablePadding: false,
        label: 'PAYOUT ACCOUNT',
        align: 'left',
        sortable: false,
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'STATUS',
        align: 'left',
        sortable: false,
    },
    {
        id: 'paid_by',
        numeric: false,
        disablePadding: false,
        label: 'PAID BY',
        align: 'left',
        sortable: false,
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'AMOUNT',
        align: 'left',
        sortable: false,
    },
    {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: '',
        align: 'left',
        sortable: false,
    },
];

export function CustomerReferralPayout() {
    const { id } = useParams<'id'>();
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState<boolean>(false);
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);

    const referralPayout = useAdminReferralPayoutsQuery({
        params: {
            filter: {
                userId: id,
            },
        },
        ...bracketParams(),
    });

    useEffect(() => {
        setIsSearchEnabled(true);
    }, []);

    useEffect(
        () => {
            if (!referralPayout.isLoading && isSearchEnabled) {
                referralPayout.sort({ sort: sortFilter ? 'created_at' : '-created_at' });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [orderBy],
    );

    const handleRequestSort = () => {
        setSortFilter(!sortFilter);
        setOrderBy(sortFilter ? 'created_at' : '-created_at');
    };

    return (
        <Root container>
            <Grid container item xs className={'CustomerReferralPayoutBox'}>
                {referralPayout.isLoading ? (
                    <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {referralPayout?.data.length !== 0 ? (
                            <TableContainer className={'ContainerBackground'}>
                                <Box p={2}>
                                    <Typography className={'TableTitle'}>
                                        Customer Payouts{' '}
                                        <span className={'HeadingText'}> ({referralPayout?.data.length})</span>
                                    </Typography>
                                </Box>
                                <CustomerPayoutListing
                                    payouts={referralPayout?.data}
                                    paginationProp={referralPayout?.paginationProps}
                                    headings={headings}
                                    handleRequestSort={handleRequestSort}
                                    orderBy={orderBy}
                                />
                            </TableContainer>
                        ) : (
                            <Grid
                                container
                                alignItems={'center'}
                                justifyContent={'center'}
                                rowSpacing={1}
                                sx={{ padding: '40px 20px' }}
                            >
                                <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                                    <PriceCheckIcon />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant={'subtitle1'}
                                        fontWeight={500}
                                        textAlign={'center'}
                                        fontSize={16}
                                    >
                                        No Payouts
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                                        This customer has no referrers payout, yet.
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

export default CustomerReferralPayout;

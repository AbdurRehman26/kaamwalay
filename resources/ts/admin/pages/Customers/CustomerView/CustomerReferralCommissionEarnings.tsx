import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { TableSortType } from '@shared/constants/TableSortType';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminCustomerReferralCommissionQuery } from '@shared/redux/hooks/useAdminCustomerReferralCommissionQuery';
import { CustomerReferralListing } from './CustomerReferralListing';

const Root = styled(Grid)({
    '.CustomerSubmissionListingBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
    },
    '.tableTitle': {
        fontSize: '16px',
        lineHeight: '24px',
        color: 'rgba(0, 0, 0, 0.87)',
        marginTop: '16px',
        fontWeight: 400,
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
    const { id } = useParams<'id'>();

    const [orderDirection, setOrderDirection] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('paid_at');

    const referralcommissionEarnings = useAdminCustomerReferralCommissionQuery({
        params: {
            customerId: id,
            perPage: 24,
        },
        ...bracketParams(),
    });

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Root container>
            <Grid container item xs className={'CustomerSubmissionListingBox'}>
                {referralcommissionEarnings.isLoading ? (
                    <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {referralcommissionEarnings?.data.length !== 0 ? (
                            <>
                                <TableContainer sx={{ background: '#F9F9F9' }}>
                                    <Box p={2}>
                                        <Typography className={'tableTitle'}>
                                            {' '}
                                            Cummissions Earnings{' '}
                                            <span> ({referralcommissionEarnings?.data.length}) </span>{' '}
                                        </Typography>
                                    </Box>
                                    <CustomerReferralListing
                                        customers={referralcommissionEarnings?.data}
                                        paginationProp={referralcommissionEarnings?.paginationProps}
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

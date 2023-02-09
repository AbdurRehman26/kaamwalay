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
import { useAdminCustomerReferralSignUpQuery } from '@shared/redux/hooks/useAdminCustomerReferralSignUpQuery';
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
        id: 'signed_at',
        numeric: false,
        disablePadding: false,
        label: 'SIGNED UP',
        align: 'left',
        sortable: true,
    },
    {
        id: 'cards',
        numeric: true,
        disablePadding: false,
        label: 'TOTAL CARDS',
        align: 'left',
        sortable: true,
    },
    {
        id: 'submission',
        numeric: false,
        disablePadding: false,
        label: 'SUBMISSIONS',
        align: 'left',
        sortable: true,
    },
    {
        id: 'total_spent',
        numeric: false,
        disablePadding: false,
        label: 'TOT.SPENT',
        align: 'left',
        sortable: true,
    },
    {
        id: 'total_commission',
        numeric: true,
        disablePadding: false,
        label: 'TOT.COMMISSION',
        align: 'left',
        sortable: true,
    },
];

export function CustomerReferralSignUp() {
    const { id } = useParams<'id'>();

    const [orderDirection, setOrderDirection] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');

    const referralSignUp = useAdminCustomerReferralSignUpQuery({
        params: {
            customerId: id,
            perPage: 24,
        },
        ...bracketParams(),
    });
    console.log('referralSignUp ', referralSignUp);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Root container>
            <Grid container item xs className={'CustomerSubmissionListingBox'}>
                {referralSignUp.isLoading ? (
                    <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {referralSignUp?.data.length !== 0 ? (
                            <>
                                <TableContainer>
                                    <CustomerReferralListing
                                        customers={referralSignUp?.data}
                                        paginationProp={referralSignUp?.paginationProps}
                                        headings={headings}
                                        handleRequestSort={handleRequestSort}
                                        orderBy={orderBy}
                                        orderDirection={orderDirection}
                                        isSignUp={true}
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
                                        No SignUp
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                                        This customer has no referrers signup, yet.
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

export default CustomerReferralSignUp;

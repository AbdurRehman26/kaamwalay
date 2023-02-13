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
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminCustomerReferralSignUpQuery } from '@shared/redux/hooks/useAdminCustomerReferralSignUpQuery';
import { CustomerReferralListing } from './CustomerReferralListing';

const Root = styled(Grid)({
    '.CustomerReferralSignUpBox': {
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
        id: 'signed_up_at',
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
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState<boolean>(false);

    const referralSignUp = useAdminCustomerReferralSignUpQuery({
        params: {
            customerId: id,
            perPage: 24,
            sort: orderBy,
        },
        ...bracketParams(),
    });

    useEffect(
        () => {
            if (!referralSignUp.isLoading) {
                referralSignUp.sort({ sort: sortFilter ? 'created_at' : '-created_at' });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortFilter],
    );

    const handleRequestSort = () => {
        setSortFilter(!sortFilter);
        setOrderBy(sortFilter ? 'created_at' : '-created_at');
    };

    return (
        <Root container>
            <Grid container item xs className={'CustomerReferralSignUpBox'}>
                {referralSignUp.isLoading ? (
                    <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {referralSignUp?.data.length !== 0 ? (
                            <>
                                <TableContainer sx={{ background: '#F9F9F9' }}>
                                    <Box p={2}>
                                        <Typography className={'tableTitle'}>
                                            {' '}
                                            Customer Sign Ups <span> ({referralSignUp?.data.length}) </span>{' '}
                                        </Typography>
                                    </Box>
                                    <CustomerReferralListing
                                        customers={referralSignUp?.data}
                                        paginationProp={referralSignUp?.paginationProps}
                                        headings={headings}
                                        handleRequestSort={handleRequestSort}
                                        orderBy={orderBy}
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

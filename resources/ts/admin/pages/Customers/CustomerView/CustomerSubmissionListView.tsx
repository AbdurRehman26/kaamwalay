import Check from '@mui/icons-material/Check';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomerSubmissionsList from '@shared/components/Customers/CustomerSubmissionsList';
import Header from '@shared/components/Customers/Header';
import { PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListAdminOrdersQuery } from '@shared/redux/hooks/useOrdersQuery';

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

const Root = styled(Grid)({
    '.CustomerSubmissionListingBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
    },
});

export function CustomerSubmissionListView() {
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [search, setSearch] = useState('');
    const [ordersCount, setOrdersCount] = useState(0);
    const { id } = useParams<'id'>();

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
            filter: {
                search,
                paymentStatus,
                customerId: id,
            },
        },
        ...bracketParams(),
    });

    useEffect(() => {
        if (!orders$.isLoading && isSearchEnabled) {
            orders$.search(
                toApiPropertiesObject({
                    search,
                    paymentStatus,
                }),
            );
        }
    }, [orders$, paymentStatus, search, isSearchEnabled]);

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

    const handleApplyFilter = useCallback(
        async (selectedPaymentStatus) => {
            if (selectedPaymentStatus === paymentStatus) {
                setPaymentStatus(null);
            } else {
                setPaymentStatus(selectedPaymentStatus);
            }

            orders$.search(
                toApiPropertiesObject({
                    search,
                    paymentStatus: selectedPaymentStatus === paymentStatus ? null : selectedPaymentStatus,
                }),
            );
        },
        [orders$, search, paymentStatus, setPaymentStatus],
    );

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
                <Grid sx={{ padding: '20px' }}>
                    <Header
                        isCustomerDetailPage={true}
                        dataLength={orders$.data.length}
                        ordersCount={ordersCount}
                        onSearch={setSearch}
                    />
                </Grid>
                {orders$.isLoading ? (
                    <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {orders$.data.length !== 0 || ordersCount !== 0 ? (
                            <>
                                <Grid container sx={{ padding: '10px' }}>
                                    <Grid alignItems={'left'}>
                                        {Object.entries(PaymentStatusMap).map(([key, status]) => {
                                            return (
                                                <FilterButton
                                                    label={status}
                                                    active={paymentStatus === key}
                                                    value={key}
                                                />
                                            );
                                        })}
                                    </Grid>
                                </Grid>
                                <TableContainer>
                                    <CustomerSubmissionsList
                                        orderData={orders$.data}
                                        paginationProp={orders$.paginationProps}
                                        isCustomerDetailPage={true}
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
                                        No Submissions
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                                        This customer has no submissions, yet.
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

export default CustomerSubmissionListView;

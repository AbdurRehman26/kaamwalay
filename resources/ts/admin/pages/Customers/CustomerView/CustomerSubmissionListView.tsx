import Check from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
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

interface CustomerSubmissionListViewProps {
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

const Root = styled(Grid)({
    '.CustomerSubmissionListingBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
    },
});

export function CustomerSubmissionListView({ search }: CustomerSubmissionListViewProps) {
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
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

    useEffect(
        () => {
            if (!orders$.isLoading && isSearchEnabled) {
                // noinspection JSIgnoredPromiseFromCall
                orders$.search(
                    toApiPropertiesObject({
                        search,
                        paymentStatus,
                    }),
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search, isSearchEnabled],
    );
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

    if (orders$.isLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Root container>
            <Grid container item xs className={'CustomerSubmissionListingBox'}>
                <Grid sx={{ padding: '20px' }}>
                    <Header isCustomerDetailPage={true} />
                </Grid>
                <Grid container sx={{ padding: '10px' }}>
                    <Grid alignItems={'left'}>
                        {Object.entries(PaymentStatusMap).map(([key, status]) => {
                            return <FilterButton label={status} active={paymentStatus === key} value={key} />;
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
            </Grid>
        </Root>
    );
}

export default CustomerSubmissionListView;

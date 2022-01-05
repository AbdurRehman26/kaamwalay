import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import KeyValueTable from '@shared/components/KeyValueTable';
import { SubmissionViewBilling } from '@shared/components/SubmissionViewBilling';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { OrderPaymentEntity } from '@shared/entities/OrderPaymentEntity';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { OrderCouponEntity } from '@shared/entities/OrderCouponEntity';

interface SubmissionsViewDetailsProps {
    serviceLevelFee: number;
    numberOfCards: number;
    placedAt: DateLike;
    declaredValue: number;
    serviceFee: number;
    shippingFee: number;
    grandTotal: number;
    customerId: number;
    customerNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    billingAddress: AddressEntity;
    shippingAddress: AddressEntity;
    extraChargesTotal: string;
    refundsTotal: string;
    payment: OrderPaymentEntity;
    pmDiscountedAmount: string;
    discountedAmount: string;
    paymentMethodId: number;
    coupon: OrderCouponEntity;
}

const useStyles = makeStyles(
    {
        root: {
            padding: '24px',
        },
    },
    { name: 'SubmissionViewDetails' },
);

export function SubmissionsViewDetails(props: SubmissionsViewDetailsProps) {
    const {
        numberOfCards,
        serviceLevelFee,
        placedAt,
        declaredValue,
        customerName,
        customerEmail,
        customerPhone,
        customerId,
        customerNumber,
        serviceFee,
        shippingFee,
        grandTotal,
        billingAddress,
        shippingAddress,
        payment,
        extraChargesTotal,
        refundsTotal,
        discountedAmount,
        pmDiscountedAmount,
        paymentMethodId,
        coupon,
    } = props;

    const classes = useStyles();
    const orderInfo = useMemo(
        () => ({
            'Service level:': `${formatCurrency(serviceLevelFee)} / Card`,
            'No. of Cards:': numberOfCards,
            'Shipping Method': 'Insured',
            'Placed:': formatDate(placedAt, 'MM/DD/YYYY [at] hh:mm A'),
            'Declared Value:': formatCurrency(declaredValue),
        }),
        [declaredValue, numberOfCards, placedAt, serviceLevelFee],
    );

    const customerInfo = useMemo(
        () =>
            [
                ['Customer:', customerName],
                customerEmail ? ['', <MuiLink href={`mailto:${customerEmail}`}>{customerEmail}</MuiLink>] : null,
                customerPhone ? ['', <MuiLink href={`tel:${customerPhone}`}>{customerPhone}</MuiLink>] : null,
                [
                    '',
                    <>
                        Customer ID:&nbsp;
                        <MuiLink component={Link} to={`/customers/${customerId}/view`} color={'primary'}>
                            {customerNumber}
                        </MuiLink>
                    </>,
                ],
            ].filter(Boolean),
        [customerEmail, customerId, customerName, customerNumber, customerPhone],
    );

    const paymentInfo = useMemo(
        () => ({
            'Total Declared Value:': formatCurrency(declaredValue),
            'Service Fee:': formatCurrency(serviceFee),
            ...(Number(pmDiscountedAmount) > 0 && {
                'Collector Coin Discount:': `-${formatCurrency(pmDiscountedAmount)}`,
            }),
            ...(Number(discountedAmount) > 0 && { 'Promo Code Discount:': `-${formatCurrency(discountedAmount)}` }),
            'Insured Shipping:': formatCurrency(shippingFee),
            ...(Number(extraChargesTotal) > 0 && { 'Extra Charge:': formatCurrency(extraChargesTotal) }),
            ...(Number(refundsTotal) > 0 && { 'Refund:': formatCurrency(refundsTotal) }),
            'Total:': formatCurrency(grandTotal),
        }),
        [
            declaredValue,
            serviceFee,
            discountedAmount,
            shippingFee,
            extraChargesTotal,
            pmDiscountedAmount,
            refundsTotal,
            grandTotal,
        ],
    );

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Grid container spacing={4}>
                <Grid item xs>
                    <KeyValueTable entries={orderInfo} />
                </Grid>
                <Grid item xs>
                    <KeyValueTable entries={customerInfo} />
                </Grid>
                <Grid item xs>
                    <KeyValueTable entries={paymentInfo} />
                </Grid>
            </Grid>
            <Box marginY={4}>
                <Divider />
            </Box>
            <SubmissionViewBilling
                billingAddress={billingAddress}
                shippingAddress={shippingAddress}
                coupon={coupon}
                payment={payment}
                paymentMethodId={paymentMethodId}
            />
        </Grid>
    );
}

export default SubmissionsViewDetails;

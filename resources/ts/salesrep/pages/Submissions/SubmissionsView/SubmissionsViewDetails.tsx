import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import KeyValueTable from '@shared/components/KeyValueTable';
import { SubmissionViewBilling } from '@shared/components/SubmissionViewBilling';
import { PaymentStatusEnum } from '@shared/constants/PaymentStatusEnum';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { AdminUserEntity } from '@shared/entities/AdminUserEntity';
import { OrderCouponEntity } from '@shared/entities/OrderCouponEntity';
import { OrderPaymentEntity } from '@shared/entities/OrderPaymentEntity';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';

interface SubmissionsViewDetailsProps {
    serviceLevelFee: number;
    numberOfCards: number;
    placedAt: DateLike;
    declaredValue: number;
    serviceFee: number;
    shippingFee: number;
    cleaningFee: number;
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
    paymentMethodDiscountedAmount: string;
    discountedAmount: string;
    amountPaidFromWallet: string;
    paymentMethodCode: string;
    coupon: OrderCouponEntity;
    paymentStatus: PaymentStatusEnum;
    walletPayment: string;
    admin?: string;
    createdBy?: AdminUserEntity;
    owner?: SalesRepEntity;
    salesmanCommission?: number;
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
        customerNumber,
        customerId,
        serviceFee,
        shippingFee,
        cleaningFee,
        grandTotal,
        billingAddress,
        shippingAddress,
        payment,
        extraChargesTotal,
        refundsTotal,
        discountedAmount,
        paymentMethodDiscountedAmount,
        paymentMethodCode,
        coupon,
        amountPaidFromWallet,
        walletPayment,
        paymentStatus,
        admin,
        salesmanCommission,
        owner,
    } = props;

    const classes = useStyles();
    const orderInfo = useMemo(
        () => ({
            'Service level:': `${formatCurrency(serviceLevelFee)} / Card`,
            'No. of Cards:': numberOfCards,
            'Shipping Method': 'Insured',
            'Placed:': formatDate(placedAt, 'MM/DD/YYYY [at] hh:mm A'),
            'Declared Value:': formatCurrency(declaredValue),
            ...(owner?.fullName && {
                'Owner:': owner?.fullName,
            }),
            ...(salesmanCommission && { 'Commission:': formatCurrency(salesmanCommission) }),
        }),
        [declaredValue, numberOfCards, placedAt, serviceLevelFee, owner, salesmanCommission],
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
        [customerEmail, customerName, customerNumber, customerPhone, customerId],
    );

    const paymentInfo = useMemo(
        () => ({
            'Total Declared Value:': formatCurrency(declaredValue),
            'Service Fee:': formatCurrency(serviceFee),
            ...(Number(paymentMethodDiscountedAmount) > 0 && {
                'Collector Coin Discount:': `-${formatCurrency(paymentMethodDiscountedAmount)}`,
            }),
            ...(Number(amountPaidFromWallet) > 0 && { 'Credit:': `-${formatCurrency(amountPaidFromWallet)}` }),
            ...(Number(discountedAmount) > 0 && { 'Promo Code Discount:': `-${formatCurrency(discountedAmount)}` }),
            'Insured Shipping:': formatCurrency(shippingFee),
            ...(Number(extraChargesTotal) > 0 && { 'Extra Charge:': formatCurrency(extraChargesTotal) }),
            ...(Number(refundsTotal) > 0 && { 'Refund:': formatCurrency(refundsTotal) }),
            ...(Number(cleaningFee) > 0 && { 'Cleaning Fee:': formatCurrency(cleaningFee) }),
            'Total:': formatCurrency(grandTotal),
        }),
        [
            declaredValue,
            serviceFee,
            discountedAmount,
            shippingFee,
            cleaningFee,
            extraChargesTotal,
            paymentMethodDiscountedAmount,
            refundsTotal,
            amountPaidFromWallet,
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
                paymentMethodCode={paymentMethodCode}
                walletPayment={walletPayment}
                paymentStatus={paymentStatus}
                mode={'admin'}
                admin={admin}
            />
        </Grid>
    );
}

export default SubmissionsViewDetails;

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PaymentStatusChip } from '@shared/components/PaymentStatusChip';
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { OrderCouponEntity } from '@shared/entities/OrderCouponEntity';
import { AddressEntity } from '../entities/AddressEntity';
import { OrderPaymentEntity } from '../entities/OrderPaymentEntity';
import { getPaymentIcon, getPaymentTitle } from '../lib/payments';
import font from '../styles/font.module.css';

interface SubmissionViewBillingProps {
    shippingAddress?: AddressEntity;
    billingAddress?: AddressEntity;
    payment?: OrderPaymentEntity;
    coupon?: OrderCouponEntity;
    paymentMethodId?: number;
    paymentStatus: PaymentStatusEnum;
    walletPayment: string;
    mode: 'customer' | 'admin';
}

export const useStyles = makeStyles(
    (theme) => ({
        paymentAvatar: {
            width: 42,
            height: 42,
        },
        root: {
            [theme.breakpoints.down('sm')]: {
                display: 'column',
            },
        },
    }),
    {
        name: 'SubmissionViewBilling',
    },
);

/**
 * @parent SubmissionViewBilling
 * @private
 * @constructor
 */
export function SubmissionViewBilling({
    shippingAddress,
    billingAddress,
    payment,
    coupon,
    paymentMethodId,
    paymentStatus,
    walletPayment,
    mode = 'customer',
}: SubmissionViewBillingProps) {
    const classes = useStyles();
    const { card, payer } = payment ?? {};
    const hasPayment = [1, 2, 3].includes(Number(paymentMethodId)); // Checking if one of our supported payment methods is on the order
    const { id } = useParams<'id'>();
    const isPaid = useMemo(() => paymentStatus === PaymentStatusEnum.PAID, [paymentStatus]);

    const { cardIcon, cardBrand } = useMemo(() => {
        if (paymentMethodId === 1) {
            return {
                cardIcon: card?.brand ? getPaymentIcon(card.brand) : null,
                cardBrand: (card?.brand ? getPaymentTitle(card.brand) : null) ?? card?.brand,
            };
        }

        if (paymentMethodId === 2) {
            return {
                cardIcon: getPaymentIcon('paypal'),
                cardBrand: getPaymentTitle('paypal'),
            };
        }

        if (paymentMethodId === 3) {
            return {
                cardIcon: getPaymentIcon('collectorCoin'),
                cardBrand: getPaymentTitle('collectorCoin'),
            };
        }

        return {
            cardIcon: '',
            cardBrand: '',
        };
    }, [card?.brand, paymentMethodId]);

    const paymentHeading = useMemo(() => {
        if (paymentMethodId === 1) {
            return `${cardBrand} ending in ${card?.last4}`;
        }

        if (paymentMethodId === 2) {
            return payer?.name;
        }

        if (paymentMethodId === 3) {
            return `Collector Coin`;
        }

        return 'Unknown card';
    }, [card?.last4, cardBrand, paymentMethodId, payer?.name]);

    const paymentSubheading = useMemo(() => {
        if (paymentMethodId === 1) {
            return `Expires ${card?.expMonth}/${card?.expYear}`;
        }

        if (paymentMethodId === 2) {
            return payer?.email;
        }

        if (paymentMethodId === 3) {
            return payment?.transaction?.hash;
        }

        return null;
    }, [card?.expMonth, card?.expYear, paymentMethodId, payer?.email, payment?.transaction?.hash]);

    const columnWidth = coupon?.code ? 3 : 4;
    return (
        <Grid container direction={'row'} spacing={4} className={classes.root}>
            <Grid item xs={12} sm={columnWidth}>
                <Typography variant={'body1'} className={font.fontWeightMedium}>
                    Shipping Address
                </Typography>
                <Typography variant={'body2'}>{shippingAddress?.getFullName()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.getAddress()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.getAddressLine2()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={columnWidth}>
                {!isPaid && mode === 'customer' ? (
                    <>
                        <Typography variant={'body1'} className={font.fontWeightMedium}>
                            Payment Status
                        </Typography>
                        <PaymentStatusChip color={paymentStatus} label={PaymentStatusMap[paymentStatus]} />
                        <Box marginTop={2} />
                        <Typography variant={'body1'} className={font.fontWeightMedium}>
                            Payment Method
                            <MuiLink marginLeft={1} component={Link} to={`/submissions/${id}/pay`}>
                                PAY NOW
                            </MuiLink>
                        </Typography>
                        <Typography variant={'body2'}>Pay Later: Not charged yet</Typography>
                        {Number(walletPayment) > 0 ? (
                            <Typography variant={'body2'}>(Credit Applied: ${walletPayment})</Typography>
                        ) : null}
                    </>
                ) : null}
                {hasPayment ? (
                    <>
                        <Typography variant={'body1'} className={font.fontWeightMedium}>
                            Payment Method
                        </Typography>

                        <Box display={'flex'} alignItems={'center'} width={'100%'} pt={0.5}>
                            {cardIcon ? <Avatar src={cardIcon} className={classes.paymentAvatar} /> : null}
                            <Box display={'flex'} flexDirection={'column'} flexGrow={1} paddingLeft={1}>
                                <Typography variant={'body2'} color={'textPrimary'}>
                                    {paymentHeading}
                                </Typography>
                                {paymentSubheading ? (
                                    <Typography variant={'caption'} color={'textSecondary'}>
                                        {paymentSubheading}
                                    </Typography>
                                ) : null}
                            </Box>
                        </Box>
                    </>
                ) : null}
            </Grid>
            <Grid item xs={12} sm={columnWidth}>
                <Typography variant={'body1'} className={font.fontWeightMedium}>
                    Billing Address
                </Typography>
                {!billingAddress || billingAddress.id === shippingAddress?.id ? (
                    <Typography variant={'body2'}>Same as shipping</Typography>
                ) : (
                    <>
                        <Typography variant={'body2'}>{billingAddress.getFullName()}</Typography>
                        <Typography variant={'body2'}>{billingAddress.getAddress()}</Typography>
                        <Typography variant={'body2'}>{billingAddress.getAddressLine2()}</Typography>
                        <Typography variant={'body2'}>{billingAddress.phone}</Typography>
                    </>
                )}
            </Grid>
            {coupon?.code ? (
                <Grid item xs={12} sm={columnWidth}>
                    <Typography variant={'body1'} className={font.fontWeightMedium}>
                        Promo Code
                    </Typography>
                    <Typography variant={'body2'}>{coupon?.code}</Typography>
                    <Typography variant={'body2'} sx={{ color: '#a9a9a9' }}>
                        {coupon?.description}
                    </Typography>
                </Grid>
            ) : null}
        </Grid>
    );
}

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useMemo } from 'react';
import { AddressEntity } from '../entities/AddressEntity';
import { OrderPaymentEntity } from '../entities/OrderPaymentEntity';
import { getPaymentIcon, getPaymentTitle } from '../lib/payments';
import font from '../styles/font.module.css';
import { OrderCouponEntity } from '@shared/entities/OrderCouponEntity';

interface SubmissionViewBillingProps {
    shippingAddress?: AddressEntity;
    billingAddress?: AddressEntity;
    payment?: OrderPaymentEntity;
    coupon?: OrderCouponEntity;
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
}: SubmissionViewBillingProps) {
    const classes = useStyles();
    const { card, payer } = payment ?? {};
    const hasPayment = !!card || !!payer;
    const isPaypal = !card && !!payer;

    const { cardIcon, cardBrand } = useMemo(() => {
        if (isPaypal) {
            return {
                cardIcon: getPaymentIcon('paypal'),
                cardBrand: getPaymentTitle('paypal'),
            };
        }

        return {
            cardIcon: card?.brand ? getPaymentIcon(card.brand) : null,
            cardBrand: (card?.brand ? getPaymentTitle(card.brand) : null) ?? card?.brand,
        };
    }, [card?.brand, isPaypal]);

    const paymentHeading = useMemo(() => {
        if (isPaypal) {
            return payer?.name;
        }

        if (cardBrand && card?.last4) {
            return `${cardBrand} ending in ${card?.last4}`;
        }
        return 'Unknown card';
    }, [card?.last4, cardBrand, isPaypal, payer?.name]);

    const paymentSubheading = useMemo(() => {
        if (isPaypal) {
            return payer?.email;
        }

        if (cardBrand && card?.last4) {
            return `Expires ${card?.expMonth}/${card?.expYear}`;
        }

        return null;
    }, [card?.expMonth, card?.expYear, card?.last4, cardBrand, isPaypal, payer?.email]);

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
            {hasPayment ? (
                <Grid item xs={12} sm={columnWidth}>
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
                </Grid>
            ) : null}
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
                        {coupon?.discountStatement}
                    </Typography>
                </Grid>
            ) : null}
        </Grid>
    );
}

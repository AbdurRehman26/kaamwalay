import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useMemo } from 'react';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { getPaymentIcon, getPaymentTitle } from '@shared/lib/payments';
import font from '@shared/styles/font.module.css';
import { OrderPaymentEntity } from '../entities/OrderPaymentEntity';

interface SubmissionViewBillingProps {
    shippingAddress?: AddressEntity;
    billingAddress?: AddressEntity;
    payment?: OrderPaymentEntity;
}

export const useStyles = makeStyles(
    {
        paymentAvatar: {
            width: 42,
            height: 42,
        },
    },
    {
        name: 'SubmissionViewBilling',
    },
);

/**
 * @parent SubmissionViewBilling
 * @private
 * @constructor
 */
export function SubmissionViewBilling({ shippingAddress, billingAddress, payment }: SubmissionViewBillingProps) {
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

    return (
        <Grid container direction={'row'} spacing={4}>
            <Grid item xs={4}>
                <Typography variant={'body1'} className={font.fontWeightMedium}>
                    Shipping Address
                </Typography>
                <Typography variant={'body2'}>{shippingAddress?.getFullName()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.getAddress()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.getAddressLine2()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.phone}</Typography>
            </Grid>
            {hasPayment ? (
                <Grid item xs={4}>
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
            <Grid item xs={4}>
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
        </Grid>
    );
}

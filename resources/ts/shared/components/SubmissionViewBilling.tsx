import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { getPaymentIcon, getPaymentTitle } from '@shared/lib/payments';
import font from '@shared/styles/font.module.css';

interface SubmissionViewBillingProps {
    shippingAddress?: AddressEntity;
    billingAddress?: AddressEntity;
    cardLast4?: number | string;
    cardExpirationMonth?: number;
    cardExpirationYear?: number;
    cardType?: string;
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
export function SubmissionViewBilling({
    shippingAddress,
    billingAddress,
    cardLast4,
    cardType,
    cardExpirationMonth,
    cardExpirationYear,
}: SubmissionViewBillingProps) {
    const classes = useStyles();
    const cardIcon = useMemo(() => (cardType ? getPaymentIcon(cardType) : null), [cardType]);
    const cardBrand = useMemo(() => (cardType ? getPaymentTitle(cardType) : null), [cardType]);

    const hasPayment = cardIcon && cardType && cardLast4 && cardExpirationMonth && cardExpirationYear;

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
                            {(cardBrand || cardType) && cardLast4 ? (
                                <Typography variant={'body2'} color={'textPrimary'}>
                                    {cardBrand || cardType} ending in {cardLast4}
                                </Typography>
                            ) : null}
                            {cardExpirationMonth && cardExpirationYear ? (
                                <Typography variant={'caption'} color={'textSecondary'}>
                                    Expires {cardExpirationMonth}/{cardExpirationYear}
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

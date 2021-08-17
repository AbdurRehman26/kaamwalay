import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { useMemo } from 'react';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { getPaymentIcon } from '@shared/lib/payments';
import font from '@shared/styles/font.module.scss';
import { useViewSubmissionBillingStyles } from './styles';

interface ViewSubmissionBillingProps {
    shippingAddress: AddressEntity;
    billingAddress: AddressEntity;
    cardLast4?: number | string;
    cardExpirationMonth?: number;
    cardExpirationYear?: number;
    cardType?: string;
}

/**
 * @parent ViewSubmissionBilling
 * @private
 * @constructor
 */
export function ViewSubmissionBilling({
    shippingAddress,
    billingAddress,
    cardLast4,
    cardType,
    cardExpirationMonth,
    cardExpirationYear,
}: ViewSubmissionBillingProps) {
    const classes = useViewSubmissionBillingStyles();
    const cardIcon = useMemo(() => (cardType ? getPaymentIcon(cardType) : null), [cardType]);

    const hasPayment = cardIcon && cardType && cardLast4 && cardExpirationMonth && cardExpirationYear;

    return (
        <Grid container direction={'row'} className={classes.root} spacing={4}>
            <Grid item xs={4}>
                <Typography variant={'body1'} className={font.fontWeightMedium}>
                    Shipping Address
                </Typography>
                <Typography variant={'body2'}>{shippingAddress.getFullName()}</Typography>
                <Typography variant={'body2'}>{shippingAddress.getAddress()}</Typography>
                <Typography variant={'body2'}>{shippingAddress.getAddressLine2()}</Typography>
                <Typography variant={'body2'}>{shippingAddress.phone}</Typography>
            </Grid>
            {hasPayment ? (
                <Grid item xs={4}>
                    <Typography variant={'body1'} className={font.fontWeightMedium}>
                        Payment Method
                    </Typography>

                    <Box display={'flex'} alignItems={'center'} width={'100%'}>
                        {cardIcon ? <Avatar src={cardIcon} className={classes.paymentAvatar} /> : null}
                        <Box display={'flex'} flexDirection={'column'} flexGrow={1} paddingLeft={1}>
                            {cardType && cardLast4 ? (
                                <Typography variant={'caption'}>
                                    {cardType} ending in {cardLast4}
                                </Typography>
                            ) : null}
                            {cardExpirationMonth && cardExpirationYear ? (
                                <Typography variant={'caption'}>
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
                {!billingAddress || billingAddress.id === shippingAddress.id ? (
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

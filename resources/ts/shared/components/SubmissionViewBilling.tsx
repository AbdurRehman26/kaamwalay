import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EditOrderAddressDialog from '@shared/components/EditOrderAddressDialog';
import { PaymentStatusChip } from '@shared/components/PaymentStatusChip';
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { OrderCouponEntity } from '@shared/entities/OrderCouponEntity';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { useAuth } from '@shared/hooks/useAuth';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { AddressEntity } from '../entities/AddressEntity';
import { OrderPaymentEntity } from '../entities/OrderPaymentEntity';
import { getPaymentIcon, getPaymentTitle } from '../lib/payments';
import font from '../styles/font.module.css';

interface SubmissionViewBillingProps {
    shippingAddress?: AddressEntity;
    billingAddress?: AddressEntity;
    payment?: OrderPaymentEntity;
    coupon?: OrderCouponEntity;
    paymentMethodCode: string;
    paymentStatus: PaymentStatusEnum;
    walletPayment: string;
    orderCustomerShipment?: ShipmentEntity | null;
    mode: 'customer' | 'admin';
    admin?: string;
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
        editAddressButton: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.35px',
            color: '#20BFB8',
            cursor: 'pointer',
            marginLeft: '7px',
            marginTop: '2px',
            '&:hover': {
                color: '#288480',
            },
        },
        trackingUrl: {
            textDecoration: 'none',
            color: '#20BFB8',
            fontWeight: 500,
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
    paymentMethodCode,
    paymentStatus,
    walletPayment,
    orderCustomerShipment,
    mode = 'customer',
    admin,
}: SubmissionViewBillingProps) {
    const classes = useStyles();
    const { card, payer } = payment ?? {};
    const hasPayment = ['stripe', 'paypal', 'collector_coin', 'manual'].includes(paymentMethodCode); // Checking if one of our supported payment methods is on the order
    const { id } = useParams<'id'>();
    const isPaid = useMemo(() => paymentStatus === PaymentStatusEnum.PAID, [paymentStatus]);
    const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false);
    const { user } = useAuth();

    const editShippingEndpointUrlPrefix = user.hasRole(RolesEnum.Admin)
        ? 'admin'
        : user.hasRole(RolesEnum.Salesman)
        ? 'salesman'
        : '';

    const { cardIcon, cardBrand } = useMemo(() => {
        if (paymentMethodCode === 'stripe') {
            return {
                cardIcon: card?.brand ? getPaymentIcon(card.brand) : null,
                cardBrand: (card?.brand ? getPaymentTitle(card.brand) : null) ?? card?.brand,
            };
        }

        if (paymentMethodCode === 'paypal') {
            return {
                cardIcon: getPaymentIcon('paypal'),
                cardBrand: getPaymentTitle('paypal'),
            };
        }

        if (paymentMethodCode === 'collector_coin') {
            return {
                cardIcon: getPaymentIcon('collectorCoin'),
                cardBrand: getPaymentTitle('collectorCoin'),
            };
        }

        return {
            cardIcon: '',
            cardBrand: '',
        };
    }, [card?.brand, paymentMethodCode]);

    const paymentHeading = useMemo(() => {
        if (paymentMethodCode === 'stripe') {
            return `${cardBrand} ending in ${card?.last4}`;
        }

        if (paymentMethodCode === 'paypal') {
            return payer?.name;
        }

        if (paymentMethodCode === 'collector_coin') {
            return `Collector Coin`;
        }

        if (paymentMethodCode === 'manual') {
            return `Manual Payment`;
        }

        return 'Unknown card';
    }, [card?.last4, cardBrand, paymentMethodCode, payer?.name]);

    const paymentSubheading = useMemo(() => {
        if (paymentMethodCode === 'stripe') {
            return `Expires ${card?.expMonth}/${card?.expYear}`;
        }

        if (paymentMethodCode === 'paypal') {
            return payer?.email;
        }

        if (paymentMethodCode === 'collector_coin') {
            return payment?.transaction?.hash;
        }

        return null;
    }, [card?.expMonth, card?.expYear, paymentMethodCode, payer?.email, payment?.transaction?.hash]);

    const handleAddressEdit = useCallback(() => {
        setIsEditAddressDialogOpen(true);
    }, []);

    const onAddressEditSubmit = useCallback(() => {
        setIsEditAddressDialogOpen(false);
        window.location.reload();
    }, []);

    const columnWidth = coupon?.code ? 3 : 4;
    return (
        <Grid container direction={'row'} spacing={4} className={classes.root}>
            <Grid item xs={12} sm={columnWidth}>
                <Grid item container>
                    <Typography variant={'body1'} className={font.fontWeightMedium}>
                        Shipping Address
                    </Typography>
                    {mode === 'admin' ? (
                        <Typography className={classes.editAddressButton} onClick={handleAddressEdit}>
                            Edit
                        </Typography>
                    ) : null}
                </Grid>
                <Typography variant={'body2'}>{shippingAddress?.getFullName()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.getAddress()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.getAddressLine2()}</Typography>
                <Typography variant={'body2'}>{shippingAddress?.phone}</Typography>
                <EditOrderAddressDialog
                    onSubmit={onAddressEditSubmit}
                    open={isEditAddressDialogOpen}
                    onClose={() => setIsEditAddressDialogOpen(false)}
                    address={shippingAddress}
                    endpointUrl={editShippingEndpointUrlPrefix + `/orders/${id}/update-shipping-address`}
                    endpointVersion={'v3'}
                />
                {orderCustomerShipment ? (
                    <Grid mt={3}>
                        <Typography variant={'body1'} className={font.fontWeightMedium}>
                            Customer Shipment Tracking #
                        </Typography>
                        <Typography variant={'body2'} pt={1}>
                            {orderCustomerShipment?.trackingUrl ? (
                                <a
                                    href={orderCustomerShipment?.trackingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={classes.trackingUrl}
                                >
                                    {orderCustomerShipment?.trackingNumber}
                                </a>
                            ) : (
                                orderCustomerShipment?.trackingNumber
                            )}
                            <Typography
                                variant={'caption'}
                                color={'rgba(0, 0, 0, 0.54)'}
                                textTransform={'uppercase'}
                                pl={1}
                            >
                                ({orderCustomerShipment?.shippingProvider})
                            </Typography>
                        </Typography>
                    </Grid>
                ) : null}
            </Grid>
            <Grid item xs={12} sm={columnWidth}>
                <Typography variant={'body1'} className={font.fontWeightMedium}>
                    Payment Status
                </Typography>
                <PaymentStatusChip color={paymentStatus} label={PaymentStatusMap[paymentStatus]} mode={mode} />
                <Box marginTop={2} />
                {!isPaid && mode === 'customer' ? (
                    <>
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
                            <Box display={'flex'} flexDirection={'column'} flexGrow={1}>
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
                {isPaid ? (
                    <>
                        {mode === 'admin' && paymentMethodCode === 'manual' ? (
                            <Box display={'flex'} alignItems={'center'} width={'100%'} pt={0.5}>
                                <Typography variant={'body2'} color={'textSecondary'}>
                                    Marked Paid by {admin}
                                </Typography>
                            </Box>
                        ) : null}
                        <Box display={'flex'} alignItems={'center'} width={'100%'} pt={0.5}>
                            <Typography variant={'body2'} color={'textSecondary'}>
                                {payment?.createdAt ? formatDate(payment?.createdAt, 'MM/DD/YYYY [at] hh:mm A') : null}
                            </Typography>
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

import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import React from 'react';
import NumberFormat from 'react-number-format';
import { getPaymentIcon, getPaymentTitle } from '@shared/lib/payments';
import OrderDetailItem from '@dashboard/components/SubmissionOrderReview/OrderDetailItem';
import Spacer from '@dashboard/components/SubmissionOrderReview/Spacer';
import useStyles from '@dashboard/components/SubmissionOrderReview/style';
import { useAppSelector } from '@dashboard/redux/hooks';

function OrderReviewSection() {
    const classes = useStyles({});
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    // Service level data
    const serviceLevelPricePerCard = useAppSelector(
        (state) => state.newSubmission.step01Data.selectedServiceLevel.price,
    );
    const maxProtectionAmount = useAppSelector(
        (state) => state.newSubmission.step01Data.selectedServiceLevel.maxProtectionAmount,
    );
    const turnaround = useAppSelector((state) => state.newSubmission.step01Data.selectedServiceLevel.turnaround);

    // Payment method data
    const paymentMethodId = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const paymentCardBrandName = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.brand);
    const paymentExpMonth = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.expMonth);
    const paymentExpYear = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.expYear);
    const paymentLast4 = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.last4);
    const billingAddress = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress);
    const shippingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress);
    const existingAddresses = useAppSelector((state) => state.newSubmission.step03Data.existingAddresses);
    const useCustomShippingAddress = useAppSelector((state) => state.newSubmission.step03Data.useCustomShippingAddress);
    const selectedExistingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedExistingAddress);
    const discountCode = useAppSelector((state) => state.newSubmission.couponState.couponCode);
    const discountStatement = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountStatement,
    );
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const finalShippingAddress =
        existingAddresses.length !== 0 && !useCustomShippingAddress && selectedExistingAddress.id !== 0
            ? selectedExistingAddress
            : shippingAddress;

    return (
        <Paper variant={'outlined'} className={classes.orderReviewSection}>
            <div className={classes.orderItemsColumn}>
                <OrderDetailItem title={'Service Level'} editStep={0}>
                    <Typography className={classes.darkBodyText}>
                        <NumberFormat
                            value={serviceLevelPricePerCard}
                            displayType={'text'}
                            thousandSeparator
                            decimalSeparator={'.'}
                            prefix={'$'}
                        />
                        &nbsp;/&nbsp;Card
                    </Typography>
                    <Typography className={classes.greyBodyText}>
                        Protection up to&nbsp;
                        <NumberFormat
                            value={maxProtectionAmount}
                            displayType={'text'}
                            thousandSeparator
                            decimalSeparator={'.'}
                            prefix={'$'}
                        />
                    </Typography>
                    <Typography className={classes.greyBodyText}>{`${turnaround} turnaround`}</Typography>
                </OrderDetailItem>
                {!isMobile ? <Spacer top={'32px'} /> : null}
                {paymentMethodId !== 3 ? (
                    <OrderDetailItem title={'Shipping Address'} editStep={2}>
                        <Typography
                            className={classes.darkBodyText}
                        >{`${finalShippingAddress.firstName} ${finalShippingAddress.lastName}`}</Typography>
                        <Typography className={classes.darkBodyText}>{`${finalShippingAddress.address} ${
                            finalShippingAddress?.flat ? `apt: ${finalShippingAddress.flat}` : ''
                        }`}</Typography>
                        <Typography
                            className={classes.darkBodyText}
                        >{`${finalShippingAddress.city}, ${finalShippingAddress.state.code} ${finalShippingAddress.zipCode}, US`}</Typography>
                    </OrderDetailItem>
                ) : isCouponApplied && paymentMethodId === 3 ? (
                    <>
                        {!isMobile ? <Spacer top={'48px'} /> : null}
                        <OrderDetailItem title={'Promo Code'} editStep={3}>
                            <Typography className={classes.darkBodyText}>{discountCode}</Typography>
                            <Typography className={classes.greyBodyText}>{discountStatement}</Typography>
                        </OrderDetailItem>
                    </>
                ) : null}
            </div>

            <div className={classes.orderItemsColumn}>
                <OrderDetailItem title={'Payment Method'} editStep={3} spaced>
                    {paymentMethodId === 1 ? (
                        <>
                            <div className={classes.cardDetailsContainer}>
                                <div className={classes.cardIconContainer}>
                                    <Avatar src={getPaymentIcon(paymentCardBrandName)!} />
                                </div>
                                <div className={classes.cardTextDetails}>
                                    <Typography className={classes.darkBodyText}>{`${getPaymentTitle(
                                        paymentCardBrandName,
                                    )} Ending in ${paymentLast4}`}</Typography>
                                    <Typography
                                        className={classes.greyBodyText}
                                    >{`Expires ${paymentExpMonth}/${paymentExpYear}`}</Typography>
                                </div>
                            </div>
                        </>
                    ) : null}

                    {paymentMethodId === 2 ? <Typography className={classes.darkBodyText}>PayPal</Typography> : null}

                    {paymentMethodId === 3 ? (
                        <Typography className={classes.darkBodyText}>Collector Coin (AGS)</Typography>
                    ) : null}
                </OrderDetailItem>
                {!isMobile ? <Spacer top={'48px'} /> : null}
                {paymentMethodId !== 3 ? (
                    <OrderDetailItem title={'Return Shipping Method'} editStep={2} spaced>
                        <Typography className={classes.darkBodyText}>{'Insured Shipping'}</Typography>
                    </OrderDetailItem>
                ) : null}
            </div>

            <div className={classes.orderItemsColumn}>
                {paymentMethodId === 3 ? (
                    <OrderDetailItem title={'Shipping Address'} editStep={2}>
                        <Typography
                            className={classes.darkBodyText}
                        >{`${finalShippingAddress.firstName} ${finalShippingAddress.lastName}`}</Typography>
                        <Typography className={classes.darkBodyText}>{`${finalShippingAddress.address} ${
                            finalShippingAddress?.flat ? `apt: ${finalShippingAddress.flat}` : ''
                        }`}</Typography>
                        <Typography
                            className={classes.darkBodyText}
                        >{`${finalShippingAddress.city}, ${finalShippingAddress.state.code} ${finalShippingAddress.zipCode}, US`}</Typography>
                    </OrderDetailItem>
                ) : (
                    <OrderDetailItem title={'Billing Address'} editStep={3}>
                        <Typography
                            className={classes.darkBodyText}
                        >{`${billingAddress.firstName} ${billingAddress.lastName}`}</Typography>
                        <Typography className={classes.darkBodyText}>{`${billingAddress.address} ${
                            billingAddress?.flat ? `apt: ${billingAddress?.flat}` : ''
                        }`}</Typography>
                        <Typography
                            className={classes.darkBodyText}
                        >{`${billingAddress.city}, ${billingAddress.state.code} ${billingAddress.zipCode}, US`}</Typography>
                    </OrderDetailItem>
                )}

                {isCouponApplied && paymentMethodId !== 3 ? (
                    <>
                        {!isMobile ? <Spacer top={'48px'} /> : null}
                        <OrderDetailItem title={'Promo Code'} editStep={3}>
                            <Typography className={classes.darkBodyText}>{discountCode}</Typography>
                            <Typography className={classes.greyBodyText}>{discountStatement}</Typography>
                        </OrderDetailItem>
                    </>
                ) : null}
            </div>
        </Paper>
    );
}

export default OrderReviewSection;

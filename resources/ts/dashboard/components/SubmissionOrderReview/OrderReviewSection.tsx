import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import NumberFormat from 'react-number-format';

import { getPaymentIcon, getPaymentTitle } from '@shared/lib/payments';

import OrderDetailItem from '@dashboard/components/SubmissionOrderReview/OrderDetailItem';
import Spacer from '@dashboard/components/SubmissionOrderReview/Spacer';
import useStyles from '@dashboard/components/SubmissionOrderReview/style';
import { useAppSelector } from '@dashboard/redux/hooks';

function OrderReviewSection() {
    const classes = useStyles({});

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
    const returnShippingMethod = 'Insured Shipping';

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
                <Spacer top={'32px'} />
                <OrderDetailItem title={'Shipping Address'} editStep={2}>
                    <Typography
                        className={classes.darkBodyText}
                    >{`${finalShippingAddress.firstName} ${finalShippingAddress.lastName}`}</Typography>
                    <Typography className={classes.darkBodyText}>{`${finalShippingAddress.address} ${
                        finalShippingAddress?.flat ? `apt: ${finalShippingAddress.flat}` : null
                    }`}</Typography>
                    <Typography
                        className={classes.darkBodyText}
                    >{`${finalShippingAddress.city}, ${finalShippingAddress.state.code} ${finalShippingAddress.zipCode}, US`}</Typography>
                </OrderDetailItem>
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
                    ) : (
                        <Typography className={classes.darkBodyText}>PayPal</Typography>
                    )}
                </OrderDetailItem>
                <Spacer top={'48px'} />
                <OrderDetailItem title={'Return Shipping Method'} editStep={2} spaced>
                    <Typography className={classes.darkBodyText}>{'Insured Shipping'}</Typography>
                </OrderDetailItem>
            </div>

            <div className={classes.orderItemsColumn}>
                <OrderDetailItem title={'Billing Address'} editStep={3}>
                    <Typography
                        className={classes.darkBodyText}
                    >{`${billingAddress.firstName} ${billingAddress.lastName}`}</Typography>
                    <Typography className={classes.darkBodyText}>{`${billingAddress.address} ${
                        billingAddress?.flat ? `apt: ${finalShippingAddress.flat}` : null
                    }`}</Typography>
                    <Typography
                        className={classes.darkBodyText}
                    >{`${billingAddress.city}, ${billingAddress.state.code} ${billingAddress.zipCode}, US`}</Typography>
                </OrderDetailItem>
            </div>
        </Paper>
    );
}

export default OrderReviewSection;

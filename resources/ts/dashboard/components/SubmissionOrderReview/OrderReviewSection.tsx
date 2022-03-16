import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import React from 'react';
import NumberFormat from 'react-number-format';
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

    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);
    const shippingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress);
    const discountCode = useAppSelector((state) => state.newSubmission.couponState.couponCode);

    const discountStatement = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountStatement,
    );
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const finalShippingAddress = shippingAddress;

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
                {isCouponApplied ? (
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
            </div>
            <div className={classes.orderItemsColumn}>
                {appliedCredit > 0 ? (
                    <OrderDetailItem title={'Credit Applied'} editStep={3} spaced>
                        <div className={classes.cardDetailsContainer}>
                            <NumberFormat
                                value={appliedCredit}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'$'}
                            />
                        </div>
                    </OrderDetailItem>
                ) : null}
            </div>
        </Paper>
    );
}

export default OrderReviewSection;

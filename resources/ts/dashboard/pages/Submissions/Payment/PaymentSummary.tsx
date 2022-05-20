import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { DefaultShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { useAuth } from '@shared/hooks/useAuth';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { pushDataToRefersion } from '@shared/lib/utils/pushDataToRefersion';
import { trackFacebookPixelEvent } from '@shared/lib/utils/trackFacebookPixelEvent';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { APIService } from '@shared/services/APIService';
import { PayWithCollectorCoinButton } from '@dashboard/components/PayWithAGS/PayWithCollectorCoinButton';
import PaypalBtn from '@dashboard/components/PaymentForm/PaypalBtn';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { clearSubmissionState, setPreviewTotal } from '@dashboard/redux/slices/newSubmissionSlice';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '345px',
        minHeight: '20px',
        marginTop: 20,
        marginLeft: 12,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    titleContainer: {
        backgroundColor: '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '55px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        marginLeft: '16px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    bodyContainer: {
        backgroundColor: '#fff',
        paddingLeft: '16px',
        paddingRight: '16px',
    },
    rowsContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        paddingTop: '24px',
        marginBottom: '24px',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowLeftText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    rowRightBoldText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'right',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    rowRightRegularText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'right',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    clickableGreenText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.35px',
        color: '#20BFB8',
        cursor: 'pointer',
        '&:hover': {
            color: '#288480',
        },
    },
    greyDescriptionText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'center',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        marginTop: '12px',
        marginBottom: '12px',
    },
    darkDescriptionText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'center',
        letterSpacing: '0.1px',
        color: '#000',
    },
    paymentActionsContainer: {
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
    },
    boldDarkText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: '12px',
    },
}));

interface PaymentSummaryProps {
    timeInMs: number;
}

export function PaymentSummary(props: PaymentSummaryProps) {
    const classes = useStyles();
    const notifications = useNotifications();
    const stripe = useStripe();
    const apiService = useInjectable(APIService);
    const dispatch = useAppDispatch();

    const { timeInMs } = props;
    const [isStripePaymentLoading, setIsStripePaymentLoading] = useState(false);
    const serviceLevelPrice = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.price);
    const paymentMethodID = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const shippingFee = useAppSelector((state) => state.newSubmission.step02Data.shippingFee);
    const shippingMethod = useAppSelector(
        (state) => state.newSubmission.shippingMethod || DefaultShippingMethodEntity,
        (a, b) => a?.id === b?.id && a?.code === b?.code,
    );
    const grandTotal = useAppSelector((state) => state.newSubmission.grandTotal);
    const refundTotal = useAppSelector((state) => state.newSubmission.refundTotal);
    const extraChargesTotal = useAppSelector((state) => state.newSubmission.extraChargesTotal);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const totalInAGS = useAppSelector((state) => state.newSubmission.totalInAgs);
    const discountedValue = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountedAmount,
    );
    const { collectorCoinDiscountPercentage } = useConfiguration();
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const couponCode = useAppSelector((state) => state.newSubmission.couponState.couponCode);
    const orderSubmission = useAppSelector((state) => state.newSubmission);
    const stripePaymentMethod = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.id);
    const user$ = useAuth().user;
    const serviceLevelId = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.id);

    const numberOfSelectedCards =
        selectedCards.length !== 0
            ? selectedCards.reduce(function (prev: number, cur: any) {
                  // @ts-ignore
                  return prev + cur?.qty;
              }, 0)
            : 0;

    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);

    const currentSelectedTurnaround = useAppSelector(
        (state) => state.newSubmission.step01Data.selectedServiceLevel.turnaround,
    );
    const currentSelectedMaxProtection = useAppSelector(
        (state) => state.newSubmission.step01Data.selectedServiceLevel.maxProtectionAmount,
    );
    const currentSelectedLevelPrice = useAppSelector(
        (state) => state.newSubmission.step01Data.selectedServiceLevel.price,
    );

    const sendECommerceDataToGA = () => {
        ReactGA.plugin.require('ecommerce');
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.placed,
        });

        ReactGA.plugin.execute('ecommerce', 'addItem', {
            id: String(orderID),
            name: `${currentSelectedTurnaround} turnaround with $${currentSelectedMaxProtection} insurance`,
            category: 'Cards',
            price: String(currentSelectedLevelPrice),
            quantity: String(numberOfSelectedCards),
        });

        ReactGA.plugin.execute('ecommerce', 'addTransaction', {
            id: String(orderID), // Doing these type coercions because GA wants this data as string
            revenue: String(grandTotal),
            shipping: String(shippingFee),
        });

        ReactGA.plugin.execute('ecommerce', 'send', null);
        ReactGA.plugin.execute('ecommerce', 'clear', null);
    };

    function getPreviewTotal() {
        const previewTotal =
            numberOfSelectedCards * serviceLevelPrice -
            Number(
                paymentMethodID === 3
                    ? (Number(collectorCoinDiscountPercentage) / 100) * (numberOfSelectedCards * serviceLevelPrice)
                    : 0,
            ) +
            shippingFee -
            Number(isCouponApplied ? discountedValue : 0) -
            refundTotal +
            extraChargesTotal -
            appliedCredit;
        dispatch(setPreviewTotal(previewTotal));
        return previewTotal;
    }

    const handleConfirmStripePayment = async () => {
        const endpoint = apiService.createEndpoint(`customer/orders/${orderID}/payments`);
        if (!stripe) {
            // Stripe.js is not loaded yet so we don't allow the btn to be clicked yet
            return;
        }
        try {
            setIsStripePaymentLoading(true);

            // Try to charge the customer
            await endpoint.post('', {
                paymentByWallet: appliedCredit,
                paymentProviderReference: {
                    id: stripePaymentMethod,
                },
                paymentMethod: {
                    id: paymentMethodID,
                },
                ...(couponCode && {
                    coupon: {
                        code: couponCode,
                    },
                    paymentPlan: {
                        id: serviceLevelId,
                    },
                }),
            });

            setIsStripePaymentLoading(false);
            dispatch(clearSubmissionState());
            dispatch(invalidateOrders());
            ReactGA.event({
                category: EventCategories.Submissions,
                action: SubmissionEvents.paid,
            });
            trackFacebookPixelEvent(FacebookPixelEvents.Purchase, {
                value: grandTotal,
                currency: 'USD',
            });
            sendECommerceDataToGA();
            googleTagManager({ event: 'google-ads-purchased', value: grandTotal });
            pushDataToRefersion(orderSubmission, user$);
            window.location.href = `/dashboard/submissions/${orderID}/view`;
        } catch (err: any) {
            if ('message' in err?.response?.data) {
                setIsStripePaymentLoading(false);
                notifications.exception(err, 'Payment Failed');
            }
            // Charge was failed by back-end so we try to charge him on the front-end
            // The reason we try this on the front-end is because maybe the charge failed due to 3D Auth, which needs to be handled by front-end
            const intent = err.response.data.paymentIntent;
            // Attempting to confirm the payment - this will also raise the 3D Auth popup if required
            const chargeResult = await stripe.confirmCardPayment(intent.clientSecret, {
                // eslint-disable-next-line camelcase
                payment_method: intent.paymentMethod,
            });

            // Checking if something else failed.
            // Eg: Insufficient funds, 3d auth failed by user, etc
            if (chargeResult.error) {
                notifications.error(chargeResult?.error?.message!, 'Error');
                setIsStripePaymentLoading(false);
            } else {
                // We're all good!
                if (chargeResult.paymentIntent.status === 'succeeded') {
                    const verifyOrderEndpoint = apiService.createEndpoint(
                        `customer/orders/${orderID}/payments/${chargeResult.paymentIntent.id}`,
                    );
                    verifyOrderEndpoint.post('').then(() => {
                        setIsStripePaymentLoading(false);
                        dispatch(clearSubmissionState());
                        dispatch(invalidateOrders());
                        ReactGA.event({
                            category: EventCategories.Submissions,
                            action: SubmissionEvents.paid,
                        });
                        trackFacebookPixelEvent(FacebookPixelEvents.Purchase, {
                            value: grandTotal,
                            currency: 'USD',
                        });
                        sendECommerceDataToGA();
                        pushDataToRefersion(orderSubmission, user$);
                        window.location.href = `/dashboard/submissions/${orderID}/view`;
                    });
                }
            }
        }
    };

    return (
        <Paper variant={'outlined'} square className={classes.container}>
            <div className={classes.bodyContainer}>
                <div className={classes.paymentActionsContainer}>
                    <>
                        {paymentMethodID === 1 || paymentMethodID === 4 ? (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isStripePaymentLoading}
                                onClick={handleConfirmStripePayment}
                            >
                                {isStripePaymentLoading ? 'Loading...' : 'Submit Payment'}
                            </Button>
                        ) : null}
                        {paymentMethodID === 2 ? <PaypalBtn /> : null}
                        {paymentMethodID === 3 ? <PayWithCollectorCoinButton /> : null}
                    </>
                </div>

                <Divider light />
                <div className={classes.rowsContainer}>
                    <div className={classes.row}>
                        <Typography className={classes.boldDarkText}>Price Summary</Typography>
                    </div>
                    <div className={classes.row}>
                        <Typography className={classes.rowLeftText}>Service Level Fee:</Typography>

                        <Typography className={classes.rowRightBoldText}>
                            <span style={{ fontWeight: 400, color: '#757575' }}>
                                (
                                <NumberFormat
                                    value={serviceLevelPrice}
                                    displayType={'text'}
                                    thousandSeparator
                                    decimalSeparator={'.'}
                                    prefix={'$'}
                                />
                                &nbsp; x {numberOfSelectedCards}) =&nbsp;
                            </span>
                            <NumberFormat
                                value={numberOfSelectedCards * serviceLevelPrice}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'$'}
                            />
                        </Typography>
                    </div>
                    {paymentMethodID === 3 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Collector Coin Discount: </Typography>
                            <NumberFormat
                                value={(
                                    (Number(collectorCoinDiscountPercentage) / 100) *
                                    (numberOfSelectedCards * serviceLevelPrice)
                                ).toFixed(2)}
                                className={classes.rowRightBoldText}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'-$'}
                            />
                        </div>
                    ) : null}

                    {appliedCredit > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Credit: </Typography>
                            <NumberFormat
                                value={appliedCredit}
                                className={classes.rowRightBoldText}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'-$'}
                            />
                        </div>
                    ) : null}

                    {isCouponApplied ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Promo Code Discount: </Typography>
                            <NumberFormat
                                value={discountedValue}
                                className={classes.rowRightBoldText}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'-$'}
                            />
                        </div>
                    ) : null}

                    <div className={classes.row} style={{ marginTop: '16px' }}>
                        {shippingMethod?.code === ShippingMethodType.InsuredShipping ? (
                            <Typography className={classes.rowLeftText}>Insured Shipping: </Typography>
                        ) : null}

                        {shippingMethod?.code === ShippingMethodType.VaultStorage ? (
                            <Typography className={classes.rowLeftText}>Storage Fee: </Typography>
                        ) : null}

                        <NumberFormat
                            value={shippingFee}
                            className={classes.rowRightBoldText}
                            displayType={'text'}
                            thousandSeparator
                            decimalSeparator={'.'}
                            prefix={'$'}
                        />
                    </div>

                    {extraChargesTotal > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Extra Charges: </Typography>
                            <NumberFormat
                                value={extraChargesTotal}
                                className={classes.rowRightBoldText}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'$'}
                            />
                        </div>
                    ) : null}

                    {refundTotal > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Refunds: </Typography>
                            <NumberFormat
                                value={refundTotal}
                                className={classes.rowRightBoldText}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'-$'}
                            />
                        </div>
                    ) : null}
                </div>
                <Divider light />

                <div className={classes.rowsContainer}>
                    <div className={classes.row}>
                        <Typography className={classes.rowLeftText}>Total:</Typography>
                        <Typography className={classes.rowRightBoldText}>
                            &nbsp;
                            {totalInAGS > 0 && paymentMethodID === 3 ? `(${totalInAGS} AGS) ` : null}
                            <NumberFormat
                                value={getPreviewTotal()}
                                className={classes.rowRightBoldText}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'$'}
                            />
                        </Typography>
                    </div>
                </div>
            </div>
            {timeInMs !== 0 ? (
                <Box sx={{ background: '#F5F5F5', padding: '15px' }}>
                    <Typography sx={{ fontSize: '12px', background: '#F5F5F5' }}>
                        You will earn <b>${(getPreviewTotal() * 5) / 100}</b> in credit by paying now.
                    </Typography>
                </Box>
            ) : null}
        </Paper>
    );
}

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { useHistory } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { APIService } from '@shared/services/APIService';
import PaypalBtn from '@dashboard/components/PaymentForm/PaypalBtn';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearSubmissionState, setCustomStep } from '../redux/slices/newSubmissionSlice';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';
import { trackFacebookPixelEvent } from '@shared/lib/utils/trackFacebookPixelEvent';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '345px',
        minHeight: '20px',
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

function SubmissionSummary() {
    const classes = useStyles();
    const serviceLevelPrice = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.price);
    const protectionLimit = useAppSelector(
        (state) => state.newSubmission?.step01Data?.selectedServiceLevel.maxProtectionAmount,
    );
    const paymentMethodID = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const stripePaymentMethod = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.id);
    const stripe = useStripe();
    const history = useHistory();
    const notifications = useNotifications();
    const apiService = useInjectable(APIService);
    const [isStripePaymentLoading, setIsStripePaymentLoading] = useState(false);
    const shippingFee = useAppSelector((state) => state.newSubmission.step02Data.shippingFee);
    const grandTotal = useAppSelector((state) => state.newSubmission.grandTotal);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const discountedValue = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountedAmount,
    );
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const numberOfSelectedCards =
        selectedCards.length !== 0
            ? selectedCards.reduce(function (prev: number, cur: any) {
                  // @ts-ignore
                  return prev + cur?.qty;
              }, 0)
            : 0;

    function onLevelEditPress() {
        dispatch(setCustomStep(0));
    }

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
            action: SubmissionEvents.paid,
            dimension1: 'Payment Method',
            metric1: paymentMethodID,
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

    let totalDeclaredValue = 0;
    selectedCards.forEach((selectedCard: any) => {
        totalDeclaredValue += (selectedCard?.qty ?? 1) * (selectedCard?.value ?? 0);
    });

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
                paymentMethodId: stripePaymentMethod,
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
            pushToDataLayer({ event: 'google-ads-purchased', orderTotal: grandTotal });
            history.push(`/submissions/${orderID}/confirmation`);
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
                        history.push(`/submissions/${orderID}/confirmation`);
                    });
                }
            }
        }
    };
    return (
        <Paper variant={'outlined'} square className={classes.container}>
            <div className={classes.titleContainer}>
                <Typography variant={'subtitle2'} className={classes.title}>
                    Summary
                </Typography>
            </div>
            <div className={classes.bodyContainer}>
                {currentStep === 4 ? (
                    <div className={classes.paymentActionsContainer}>
                        <>
                            {paymentMethodID === 1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isStripePaymentLoading}
                                    onClick={handleConfirmStripePayment}
                                >
                                    {isStripePaymentLoading ? 'Loading...' : 'Complete Submission'}
                                </Button>
                            ) : (
                                <PaypalBtn />
                            )}
                        </>

                        <Typography className={classes.greyDescriptionText}>
                            By clicking the above button, you are agreeing to the Robograding{' '}
                            <a href={'/terms-and-conditions'} className={classes.darkDescriptionText}>
                                Terms and Conditions.
                            </a>
                        </Typography>
                    </div>
                ) : null}

                {currentStep === 4 ? (
                    <>
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
                                <Typography className={classes.rowLeftText}>Insured Shipping: </Typography>
                                <NumberFormat
                                    value={shippingFee}
                                    className={classes.rowRightBoldText}
                                    displayType={'text'}
                                    thousandSeparator
                                    decimalSeparator={'.'}
                                    prefix={'$'}
                                />
                            </div>
                        </div>
                        <Divider light />
                    </>
                ) : null}

                {currentStep === 4 ? (
                    <>
                        <div className={classes.rowsContainer}>
                            <div className={classes.row}>
                                <Typography className={classes.rowLeftText}>Total:</Typography>
                                <Typography className={classes.rowRightBoldText}>
                                    &nbsp;
                                    <NumberFormat
                                        value={grandTotal}
                                        className={classes.rowRightBoldText}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                    />
                                </Typography>
                            </div>
                        </div>
                        <Divider light />
                    </>
                ) : null}

                {currentStep === 1 ? (
                    <>
                        <div className={classes.rowsContainer}>
                            <div className={classes.row}>
                                <Typography className={classes.rowLeftText}>Service Level</Typography>
                                <Typography className={classes.rowRightBoldText}>
                                    <span>
                                        <NumberFormat
                                            value={serviceLevelPrice}
                                            displayType={'text'}
                                            thousandSeparator
                                            decimalSeparator={'.'}
                                            prefix={'$'}
                                        />
                                    </span>
                                    &nbsp; / Card
                                </Typography>
                            </div>
                            <div className={classes.row} style={{ marginTop: '12px' }}>
                                <Typography className={classes.clickableGreenText} onClick={onLevelEditPress}>
                                    EDIT
                                </Typography>
                                <div style={{ flexDirection: 'row' }}>
                                    <NumberFormat
                                        value={protectionLimit}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                        className={classes.rowRightRegularText}
                                    />
                                    <span className={classes.rowRightRegularText}> Max. Value Per Card</span>
                                </div>
                            </div>
                        </div>
                        <Divider light />
                    </>
                ) : null}

                {currentStep === 2 || currentStep === 3 ? (
                    <>
                        <div className={classes.rowsContainer}>
                            <div className={classes.row}>
                                <Typography className={classes.rowRightBoldText}>
                                    ${totalDeclaredValue} Total Declared Value
                                </Typography>
                            </div>
                            <div className={classes.row} style={{ marginTop: '12px' }}>
                                <Typography className={classes.clickableGreenText} onClick={onLevelEditPress}>
                                    EDIT
                                </Typography>
                            </div>
                        </div>
                        <Divider light />
                    </>
                ) : null}

                {currentStep === 1 ? (
                    <>
                        <div className={classes.rowsContainer}>
                            <div className={classes.row}>
                                <Typography className={classes.rowLeftText}>Number of Cards:</Typography>
                                <Typography className={classes.rowRightBoldText}>{numberOfSelectedCards}</Typography>
                            </div>
                            <div className={classes.row} style={{ marginTop: '16px' }}>
                                <Typography className={classes.rowLeftText}>Price / Card:</Typography>
                                <NumberFormat
                                    value={serviceLevelPrice}
                                    className={classes.rowRightBoldText}
                                    displayType={'text'}
                                    thousandSeparator
                                    decimalSeparator={'.'}
                                    prefix={'$'}
                                />
                            </div>
                        </div>
                        <Divider light />
                    </>
                ) : null}

                {currentStep === 2 || currentStep === 3 ? (
                    <>
                        <div className={classes.rowsContainer}>
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
                                <Typography className={classes.rowLeftText}>Insured Shipping: </Typography>
                                <NumberFormat
                                    value={shippingFee}
                                    className={classes.rowRightBoldText}
                                    displayType={'text'}
                                    thousandSeparator
                                    decimalSeparator={'.'}
                                    prefix={'$'}
                                />
                            </div>
                        </div>
                        <Divider light />
                    </>
                ) : null}

                {currentStep === 2 || currentStep === 3 ? (
                    <>
                        <div className={classes.rowsContainer}>
                            <div className={classes.row}>
                                <Typography className={classes.rowLeftText}>Total:</Typography>
                                <Typography className={classes.rowRightBoldText}>
                                    &nbsp;
                                    <NumberFormat
                                        value={
                                            numberOfSelectedCards * serviceLevelPrice +
                                            shippingFee -
                                            Number(isCouponApplied ? discountedValue : 0)
                                        }
                                        className={classes.rowRightBoldText}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                    />
                                </Typography>
                            </div>
                        </div>
                        <Divider light />
                    </>
                ) : null}

                {currentStep === 1 ? (
                    <>
                        <div className={classes.rowsContainer}>
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
                        </div>
                    </>
                ) : null}
            </div>
        </Paper>
    );
}

export default SubmissionSummary;

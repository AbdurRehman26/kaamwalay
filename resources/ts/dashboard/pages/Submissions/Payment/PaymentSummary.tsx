import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { round } from 'lodash';
import React, { useCallback, useState } from 'react';
import { PaymentMethodsEnum } from '@shared/constants/PaymentMethodsEnum';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { DefaultShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { APIService } from '@shared/services/APIService';
import { PayWithCollectorCoinButton } from '@dashboard/components/PayWithAGS/PayWithCollectorCoinButton';
import PaypalBtn from '@dashboard/components/PaymentForm/PaypalBtn';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import {
    clearSubmissionState,
    setDisplayAffirmMethod,
    setPreviewTotal,
} from '@dashboard/redux/slices/newSubmissionSlice';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '345px',
        minHeight: '20px',
        marginTop: 20,
        marginLeft: 12,
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginLeft: 0,
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
    featureOrderWalletCreditPercentage: number;
    featureOrderWalletCreditEnabled: boolean;
}

export function PaymentSummary(props: PaymentSummaryProps) {
    const classes = useStyles();
    const notifications = useNotifications();
    const apiService = useInjectable(APIService);
    const dispatch = useAppDispatch();
    const displayAffirm = useAppSelector((state) => state.newSubmission.displayAffirm);

    const { timeInMs, featureOrderWalletCreditPercentage, featureOrderWalletCreditEnabled } = props;
    const [isStripePaymentLoading, setIsStripePaymentLoading] = useState(false);
    const serviceLevelPrice = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.price);
    const paymentMethodID = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const paymentMethodCode = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodCode);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const shippingFee = useAppSelector((state) => state.newSubmission.step02Data.shippingFee);
    const shippingMethod = useAppSelector(
        (state) => state.newSubmission.shippingMethod || DefaultShippingMethodEntity,
        (a, b) => a?.id === b?.id && a?.code === b?.code,
    );
    const refundTotal = useAppSelector((state) => state.newSubmission.refundTotal);
    const cleaningFee = useAppSelector((state) => state.newSubmission.step02Data.cleaningFee);
    const shippingInsuranceFee = useAppSelector((state) => state.newSubmission.step03Data.shippingInsuranceFee);
    const signatureFee = useAppSelector((state) => state.newSubmission.step03Data.signatureFee);
    const extraChargesTotal = useAppSelector((state) => state.newSubmission.extraChargesTotal);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const totalInAGS = useAppSelector((state) => state.newSubmission.totalInAgs);
    const discountedValue = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountedAmount,
    );
    const { collectorCoinDiscountPercentage, featureOrderPaymentAffirmMinAmount } = useConfiguration();
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const couponCode = useAppSelector((state) => state.newSubmission.couponState.couponCode);
    const stripePaymentMethod = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.id);
    const originalPaymentPlanId = useAppSelector((state) => state.newSubmission?.step01Data?.originalServiceLevel.id);
    const isCouponValid = useAppSelector((state) => state.newSubmission?.couponState.isCouponValid);
    const numberOfSelectedCards =
        selectedCards.length !== 0
            ? selectedCards.reduce(function (prev: number, cur: any) {
                  // @ts-ignore
                  return prev + cur?.qty;
              }, 0)
            : 0;

    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);

    function getPreviewTotal() {
        const previewTotal = Number(
            (
                numberOfSelectedCards * serviceLevelPrice -
                Number(
                    paymentMethodID === 3
                        ? (Number(collectorCoinDiscountPercentage) / 100) * (numberOfSelectedCards * serviceLevelPrice)
                        : 0,
                ) +
                shippingFee -
                Number(isCouponApplied ? discountedValue : 0) -
                refundTotal +
                Number(shippingInsuranceFee) +
                Number(cleaningFee) +
                Number(signatureFee) +
                extraChargesTotal -
                appliedCredit
            ).toFixed(2),
        );
        dispatch(setDisplayAffirmMethod(previewTotal > featureOrderPaymentAffirmMinAmount));
        dispatch(setPreviewTotal(previewTotal));
        return previewTotal;
    }

    const handleConfirmStripePayment = async () => {
        const endpoint = apiService.createEndpoint(`customer/orders/${orderID}/payments`);
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
                        code: isCouponApplied ? couponCode : -1,
                    },
                    paymentPlan: {
                        id: originalPaymentPlanId,
                    },
                }),
            });

            setIsStripePaymentLoading(false);
            dispatch(clearSubmissionState());
            dispatch(invalidateOrders());
            window.location.href = `/dashboard/submissions/${orderID}/view`;
        } catch (err: any) {
            if ('message' in err?.response?.data) {
                setIsStripePaymentLoading(false);
                notifications.exception(err, 'Payment Failed');
            }
        }
    };

    const handleAffirmPayment = async () => {
        const endpoint = apiService.createEndpoint(`customer/orders/${orderID}/payments`);
        try {
            setIsStripePaymentLoading(true);

            // Try to charge the customer
            const res = await endpoint.post('', {
                paymentByWallet: appliedCredit,
                paymentMethod: {
                    id: paymentMethodID,
                },
                ...(couponCode && {
                    coupon: {
                        code: isCouponApplied ? couponCode : -1,
                    },
                    paymentPlan: {
                        id: originalPaymentPlanId,
                    },
                }),
            });

            setIsStripePaymentLoading(false);
            dispatch(clearSubmissionState());
            dispatch(invalidateOrders());
            const { data } = res;
            confirmStripeAffirm(data.intent);
        } catch (err: any) {
            if (err.response.data.success) {
                confirmStripeAffirm(err.response.data.paymentIntent);
            }

            if ('message' in err?.response?.data) {
                setIsStripePaymentLoading(false);
                notifications.exception(err, 'Payment Failed');
            }
        }
    };

    const confirmStripeAffirm = useCallback(
        (intent: string) => {
            // @ts-ignore
            stripe.confirmAffirmPayment(intent, {
                // eslint-disable-next-line camelcase
                payment_method: {
                    // eslint-disable-next-line camelcase
                    billing_details: {},
                },

                // eslint-disable-next-line camelcase
                return_url: window.location.origin + `/dashboard/submissions/${orderID}/affirm/confirmation`,
            });
        },
        [orderID],
    );

    return (
        <Paper variant={'outlined'} square className={classes.container}>
            <div className={classes.bodyContainer}>
                <div className={classes.paymentActionsContainer}>
                    <>
                        {paymentMethodID === 1 || paymentMethodID === 4 ? (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isStripePaymentLoading || !isCouponValid}
                                onClick={handleConfirmStripePayment}
                                sx={{ height: 48 }}
                            >
                                {isStripePaymentLoading ? 'Loading...' : 'Submit Payment'}
                            </Button>
                        ) : null}
                        {paymentMethodID === 2 ? <PaypalBtn /> : null}
                        {paymentMethodID === 3 ? <PayWithCollectorCoinButton /> : null}
                        {paymentMethodCode === PaymentMethodsEnum.STRIPE_AFFIRM && displayAffirm ? (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isStripePaymentLoading || !isCouponValid}
                                onClick={handleAffirmPayment}
                                sx={{ height: 48 }}
                            >
                                {isStripePaymentLoading ? 'Loading...' : 'PAY WITH AFFIRM'}
                            </Button>
                        ) : null}
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
                                ( &nbsp; x {numberOfSelectedCards}) =&nbsp;
                            </span>
                        </Typography>
                    </div>
                    {paymentMethodID === 3 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Collector Coin Discount: </Typography>
                        </div>
                    ) : null}

                    {appliedCredit > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Credit: </Typography>
                        </div>
                    ) : null}

                    {isCouponApplied ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Promo Code Discount: </Typography>
                        </div>
                    ) : null}

                    <div className={classes.row} style={{ marginTop: '16px' }}>
                        {shippingMethod?.code === ShippingMethodType.InsuredShipping ? (
                            <Typography className={classes.rowLeftText}>Shipping: </Typography>
                        ) : null}

                        {shippingMethod?.code === ShippingMethodType.VaultStorage ? (
                            <Typography className={classes.rowLeftText}>Storage Fee: </Typography>
                        ) : null}
                    </div>

                    {extraChargesTotal > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Extra Charges: </Typography>
                        </div>
                    ) : null}

                    {(shippingInsuranceFee ?? 0) > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Insurance: </Typography>
                        </div>
                    ) : null}

                    {cleaningFee > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Cleaning Fee: </Typography>
                        </div>
                    ) : null}

                    {(signatureFee ?? 0) > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Signature Required: </Typography>
                        </div>
                    ) : null}

                    {refundTotal > 0 ? (
                        <div className={classes.row} style={{ marginTop: '16px' }}>
                            <Typography className={classes.rowLeftText}>Refunds: </Typography>
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
                        </Typography>
                    </div>
                </div>
            </div>
            {timeInMs !== 0 && featureOrderWalletCreditEnabled && !isCouponApplied ? (
                <Box sx={{ background: '#F5F5F5', padding: '15px' }}>
                    <Typography sx={{ fontSize: '12px', background: '#F5F5F5' }}>
                        You will earn{' '}
                        <b>${round((getPreviewTotal() * featureOrderWalletCreditPercentage) / 100, 2).toFixed(2)}</b> in
                        credit by paying now.
                    </Typography>
                </Box>
            ) : null}
        </Paper>
    );
}

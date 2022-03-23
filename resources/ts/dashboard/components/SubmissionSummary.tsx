import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { EventCategories, PaymentMethodEvents } from '@shared/constants/GAEventsTypes';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearSubmissionState, createOrder, setCustomStep, setPreviewTotal } from '../redux/slices/newSubmissionSlice';

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
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const navigate = useNavigate();
    const shippingFee = useAppSelector((state) => state.newSubmission.step02Data.shippingFee);
    const grandTotal = useAppSelector((state) => state.newSubmission.grandTotal);
    const discountedValue = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountedAmount,
    );
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const [submitting, setIsSubmitting] = useState(false);

    const numberOfSelectedCards =
        selectedCards.length !== 0
            ? selectedCards.reduce(function (prev: number, cur: any) {
                  // @ts-ignore
                  return prev + cur?.qty;
              }, 0)
            : 0;

    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);
    function onLevelEditPress() {
        dispatch(setCustomStep(0));
    }

    let totalDeclaredValue = 0;
    selectedCards.forEach((selectedCard: any) => {
        totalDeclaredValue += (selectedCard?.qty ?? 1) * (selectedCard?.value ?? 0);
    });

    const handleCompleteSubmission = async () => {
        try {
            setIsSubmitting(true);
            const order = await dispatch(createOrder()).unwrap();
            ReactGA.event({
                category: EventCategories.Submissions,
                action: PaymentMethodEvents.payLater,
            });
            dispatch(clearSubmissionState());
            dispatch(invalidateOrders());
            navigate(`/submissions/${order.id}/confirmation`);
        } catch (err: any) {}
    };

    function getPreviewTotal() {
        const previewTotal =
            numberOfSelectedCards * serviceLevelPrice +
            shippingFee -
            Number(isCouponApplied ? discountedValue : 0) -
            appliedCredit;
        dispatch(setPreviewTotal(previewTotal));
        return previewTotal;
    }

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
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCompleteSubmission}
                                disabled={submitting}
                            >
                                {'Complete Submission'}
                            </Button>
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

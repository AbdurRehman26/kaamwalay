import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import PaypalBtn from '@dashboard/components/PaymentForm/PaypalBtn';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';
import { pushDataToRefersion } from '@shared/lib/utils/pushDataToRefersion';
import { PayWithCollectorCoinButton } from '@dashboard/components/PayWithAGS/PayWithCollectorCoinButton';
import { useAuth } from '@shared/hooks/useAuth';
import {useAppSelector} from "@dashboard/redux/hooks";

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

function PaymentSummary() {
    const classes = useStyles();
    const serviceLevelPrice = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.price);
    const paymentMethodID = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const navigate = useNavigate();
    const shippingFee = useAppSelector((state) => state.newSubmission.step02Data.shippingFee);
    const grandTotal = useAppSelector((state) => state.newSubmission.grandTotal);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const totalInAGS = useAppSelector((state) => state.newSubmission.totalInAgs);
    const discountedValue = useAppSelector(
            (state) => state.newSubmission.couponState.appliedCouponData.discountedAmount,
    );
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const paymentMethodDiscountedAmount = useAppSelector((state) => state.newSubmission.paymentMethodDiscountedAmount);
    const orderSubmission = useAppSelector((state) => state.newSubmission);
    const user$ = useAuth().user;

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

    let totalDeclaredValue = 0;
    selectedCards.forEach((selectedCard: any) => {
        totalDeclaredValue += (selectedCard?.qty ?? 1) * (selectedCard?.value ?? 0);
    });

    const handleConfirmStripePayment = async () => {
        sendECommerceDataToGA();
        pushToDataLayer({ event: 'google-ads-purchased', value: grandTotal });
        pushDataToRefersion(orderSubmission, user$);
        navigate(`/submissions/${orderID}/confirmation`);
    };

    return (
            <Paper variant={'outlined'} square className={classes.container}>
                <div className={classes.bodyContainer}>
                    <div className={classes.paymentActionsContainer}>
                        <>
                            <Button variant="contained" color="primary" onClick={handleConfirmStripePayment}>
                                Submit Payment
                            </Button>
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
                        {paymentMethodDiscountedAmount > 0 ? (
                                <div className={classes.row} style={{ marginTop: '16px' }}>
                                    <Typography className={classes.rowLeftText}>Collector Coin Discount: </Typography>
                                    <NumberFormat
                                            value={paymentMethodDiscountedAmount}
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

                    <div className={classes.rowsContainer}>
                        <div className={classes.row}>
                            <Typography className={classes.rowLeftText}>Total:</Typography>
                            <Typography className={classes.rowRightBoldText}>
                                &nbsp;
                                {totalInAGS > 0 && paymentMethodID === 3 ? `(${totalInAGS} AGS) ` : null}
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
                </div>
            </Paper>
    );
}

export default PaymentSummary;

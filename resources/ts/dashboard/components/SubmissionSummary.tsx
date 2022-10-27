import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import NumberFormat from 'react-number-format';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { DefaultShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setCleaningFee, setCustomStep, setPreviewTotal } from '../redux/slices/newSubmissionSlice';
import CompleteSubmissionButton from './CompleteSubmissionButton';
import SubmissionSummaryDescription from './SubmissionSummaryDescription';

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
    const priceRanges = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.priceRanges);

    const protectionLimit = useAppSelector(
        (state) => state.newSubmission?.step01Data?.selectedServiceLevel.maxProtectionAmount,
    );
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const shippingFee = useAppSelector((state) => state.newSubmission.step02Data.shippingFee);
    const requiresCleaning = useAppSelector((state) => state.newSubmission.step02Data.requiresCleaning);
    const cleaningFee = useAppSelector((state) => state.newSubmission.step02Data.cleaningFee);
    const shippingMethod = useAppSelector(
        (state) => state.newSubmission.shippingMethod || DefaultShippingMethodEntity,
        (a, b) => a?.id === b?.id && a?.code === b?.code,
    );
    const discountedValue = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountedAmount,
    );
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);

    const { featureOrderCleaningFeePerCard, featureOrderCleaningFeeMaxCap } = useConfiguration();

    const numberOfSelectedCards =
        selectedCards.length !== 0
            ? selectedCards.reduce(function (prev: number, cur: any) {
                  // @ts-ignore
                  return prev + cur?.qty;
              }, 0)
            : 0;

    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);

    let finalPrice =
        priceRanges?.filter((item: any) => {
            if (numberOfSelectedCards >= item.minCards && numberOfSelectedCards <= item.maxCards) {
                return item;
            }
        }) ?? null;

    finalPrice = finalPrice ? finalPrice[0]?.price : serviceLevelPrice;

    function onLevelEditPress() {
        dispatch(setCustomStep(0));
    }

    let totalDeclaredValue = 0;
    selectedCards.forEach((selectedCard: any) => {
        totalDeclaredValue += (selectedCard?.qty ?? 1) * (selectedCard?.value ?? 0);
    });

    function getCleaningFee() {
        const calculatedCleaningFee = numberOfSelectedCards * featureOrderCleaningFeePerCard;
        const previewCleaningFee =
            calculatedCleaningFee >= featureOrderCleaningFeeMaxCap
                ? featureOrderCleaningFeeMaxCap
                : calculatedCleaningFee;
        dispatch(setCleaningFee(previewCleaningFee));
        return previewCleaningFee;
    }

    function getPreviewTotal() {
        const previewTotal =
            numberOfSelectedCards * finalPrice +
            Number(cleaningFee) +
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
                {currentStep === 4 && !isMobile ? (
                    <div className={classes.paymentActionsContainer}>
                        <>
                            <CompleteSubmissionButton buttonText={'Complete Submission'} hasStyle={false} />
                        </>
                        <SubmissionSummaryDescription summaryDescription={'the above button'} />
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
                                            value={finalPrice ?? 0}
                                            displayType={'text'}
                                            thousandSeparator
                                            decimalSeparator={'.'}
                                            prefix={'$'}
                                        />
                                        &nbsp; x {numberOfSelectedCards}) =&nbsp;
                                    </span>
                                    <NumberFormat
                                        value={numberOfSelectedCards * finalPrice ?? 0}
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

                            {requiresCleaning ? (
                                <div className={classes.row} style={{ marginTop: '16px' }}>
                                    <Typography className={classes.rowLeftText}>Cleaning Fee: </Typography>
                                    <NumberFormat
                                        value={getCleaningFee()}
                                        className={classes.rowRightBoldText}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                    />
                                </div>
                            ) : null}
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
                                    <NumberFormat
                                        value={priceRanges?.slice(-1)[0]?.price}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                    />
                                    &nbsp;
                                    <span>-</span>
                                    &nbsp;
                                    <NumberFormat
                                        value={priceRanges[0]?.price}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                    />
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
                                    value={finalPrice ?? 0}
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
                                            value={finalPrice ?? 0}
                                            displayType={'text'}
                                            thousandSeparator
                                            decimalSeparator={'.'}
                                            prefix={'$'}
                                        />
                                        &nbsp; x {numberOfSelectedCards}) =&nbsp;
                                    </span>
                                    <NumberFormat
                                        value={numberOfSelectedCards * finalPrice ?? 0}
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

                            {requiresCleaning ? (
                                <div className={classes.row} style={{ marginTop: '16px' }}>
                                    <Typography className={classes.rowLeftText}>Cleaning Fee: </Typography>
                                    <NumberFormat
                                        value={getCleaningFee()}
                                        className={classes.rowRightBoldText}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <Divider light />
                    </>
                ) : null}
                {currentStep === 2 || currentStep === 3 || currentStep === 4 ? (
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
                                            value={finalPrice ?? 0}
                                            displayType={'text'}
                                            thousandSeparator
                                            decimalSeparator={'.'}
                                            prefix={'$'}
                                        />
                                        &nbsp; x {numberOfSelectedCards}) =&nbsp;
                                    </span>
                                    <NumberFormat
                                        value={numberOfSelectedCards * finalPrice ?? 0}
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

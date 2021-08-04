import {
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Alert from '@material-ui/lab/Alert';
import CardValidator from 'card-validator';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    getServiceLevels,
    setIsNextDisabled,
    setSaveCardForLater,
    setUseShippingAddressAsBilling,
    updatePaymentMethodField,
} from '../redux/slices/newSubmissionSlice';
import CardsSearchResults from './CardsSearchResults';
import PaymentMethodItem from './PaymentMethodItem';
import ServiceLevelItem from './ServiceLevelItem';
import ShippingMethodItem from './ShippingMethodItems';
import StepDescription from './StepDescription';
import SubmissionSummary from './SubmissionSummary';

[{ id: 22, name: 'California', isoCode: 223 }];

const useStyles = makeStyles({
    stepDescriptionContainer: {
        maxWidth: '425px',
    },
    leftSideContainer: {
        marginTop: '12px',
    },
    divider: {
        marginTop: '64px',
    },
    valueAlert: {
        marginTop: '16px',
    },
    shippingMethodContainer: {
        marginBottom: '24px',
    },
    sectionLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        marginBottom: '20px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
    },
    methodDescription: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.1px',
        marginBottom: '4px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    shippingAddressContainer: {
        marginTop: '32px',
    },
    shippingMethodItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shippingAddressSectionHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fieldContainer: {
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
    },
    inputsRow01: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputsRow02: {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputsRow03: {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputsRow04: {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    billingAddressAsShippingContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '12px',
    },
    billingAddressTitle: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    billingAddressItem: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
});

const GreenCheckbox = withStyles({
    root: {
        color: '#20BFB8',
        '&$checked': {
            color: '#20BFB8',
        },
    },
    checked: {},
})((props: any) => <Checkbox color="default" {...props} />);

function limit(val: any, max: any) {
    if (val.length === 1 && val[0] > max[0]) {
        val = '0' + val;
    }

    if (val.length === 2) {
        if (Number(val) === 0) {
            val = '01';

            //this can happen when user paste number
        } else if (val > max) {
            val = max;
        }
    }

    return val;
}

function cardExpiry(val: any) {
    let month = limit(val.substring(0, 2), '12');
    let year = val.substring(2, 4);

    return month + (year.length ? '/' + year : '');
}

export function SubmissionStep04Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const paymentMethodId = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const saveCardForLater = useAppSelector((state) => state.newSubmission.step04Data.saveForLater);
    const cardNumber = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.cardNumber);
    const cvv = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.cvv);
    const expirationDate = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.expirationDate);
    const useBillingAddressSameAsShipping = useAppSelector(
        (state) => state.newSubmission.step04Data.useShippingAddressAsBillingAddress,
    );

    function onSaveCardForLater() {
        dispatch(setSaveCardForLater(!saveCardForLater));
    }

    function onUseShippingAddressAsBilling() {
        dispatch(setUseShippingAddressAsBilling(!useBillingAddressSameAsShipping));
    }

    function updateCardData(fieldName: string, newValue: any) {
        dispatch(updatePaymentMethodField({ fieldName, newValue }));
    }

    useEffect(() => {
        dispatch(setIsNextDisabled(true));
    }, [dispatch]);

    useEffect(() => {
        const isNumberValid = CardValidator.number(cardNumber).isValid;
        const isCvvValid = CardValidator.cvv(cvv).isValid;
        const isExpirationValid = CardValidator.expirationDate(expirationDate).isValid;

        if (isNumberValid && isCvvValid && isExpirationValid) {
            dispatch(setIsNextDisabled(false));
        } else {
            dispatch(setIsNextDisabled(true));
        }
    }, [cvv, expirationDate, cardNumber]);

    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title={`Enter your Payment Details`}
                    description={'Select your payment method and enter details.'}
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        <div className={classes.shippingMethodContainer}>
                            <Typography className={classes.sectionLabel}> Select Payment Method </Typography>
                            <div className={classes.shippingMethodItemContainer}>
                                <PaymentMethodItem
                                    isSelected={paymentMethodId === 0}
                                    methodName={'Credit or Debit Card'}
                                    methodId={0}
                                />
                                <PaymentMethodItem
                                    isSelected={paymentMethodId === 1}
                                    methodName={'Paypal'}
                                    methodId={1}
                                />
                            </div>
                        </div>
                        <Divider light />
                        <div className={classes.shippingAddressContainer}>
                            <div className={classes.shippingAddressSectionHeader}>
                                <Typography className={classes.sectionLabel}>Add Card</Typography>
                                <FormControlLabel
                                    control={
                                        <GreenCheckbox
                                            checked={saveCardForLater}
                                            onChange={onSaveCardForLater}
                                            name="checkedG"
                                        />
                                    }
                                    label="Save for later"
                                />
                            </div>

                            <div className={classes.inputsRow01}>
                                <div className={classes.fieldContainer} style={{ width: '100%' }}>
                                    <Typography className={classes.methodDescription}>Card Number</Typography>
                                    <NumberFormat
                                        format="#### #### #### ####"
                                        customInput={TextField}
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter Card Number"
                                        value={cardNumber}
                                        onChange={(e) => updateCardData('cardNumber', e.target.value)}
                                        fullWidth
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.inputsRow02}>
                                <div className={classes.fieldContainer} style={{ width: '65%' }}>
                                    <Typography className={classes.methodDescription}>Expiration Date</Typography>

                                    <NumberFormat
                                        format={cardExpiry}
                                        customInput={TextField}
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="MM/YY"
                                        fullWidth
                                        value={expirationDate}
                                        onChange={(e) => updateCardData('expirationDate', e.target.value)}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <div className={classes.fieldContainer} style={{ width: '28%' }}>
                                    <Typography className={classes.methodDescription}>CVV</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="XXX"
                                        fullWidth
                                        value={cvv}
                                        onChange={(e) => updateCardData('cvv', e.target.value)}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputProps={{
                                            inputProps: {
                                                maxLength: 3,
                                            },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={classes.billingAddressAsShippingContainer}>
                            <FormControlLabel
                                control={
                                    <GreenCheckbox
                                        checked={useBillingAddressSameAsShipping}
                                        onChange={onUseShippingAddressAsBilling}
                                    />
                                }
                                label="Billing address same as shipping"
                            />
                            <Typography className={classes.billingAddressTitle}>Billing Address</Typography>
                            <Typography className={classes.billingAddressItem}>James Smith</Typography>
                            <Typography className={classes.billingAddressItem}>727 Amsterdam Blvd.</Typography>
                            <Typography className={classes.billingAddressItem}>New York, NY 10301, US</Typography>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SubmissionSummary />
                </Grid>
            </Grid>

            <Divider light className={classes.divider} />
        </Container>
    );
}

export default SubmissionStep04Content;

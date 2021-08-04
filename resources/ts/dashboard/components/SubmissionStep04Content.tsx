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
import * as yup from 'yup';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    getServiceLevels,
    setBillingAddressEqualToShippingAddress,
    setIsNextDisabled,
    setSaveCardForLater,
    setUseShippingAddressAsBilling,
    updateBillingAddressField,
    updatePaymentMethodField,
    updateShippingAddressField,
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
    sectionContainer: {
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

let schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    address: yup.string().required(),
    apt: yup.string().optional(),
    city: yup.string().required(),
    state: yup.object().shape({
        name: yup.string().required(),
        id: yup.number().required(),
    }),
    zipCode: yup.string().required(),
    phoneNumber: yup.string().required(),
});

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
    const shippingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress);

    const firstName = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.firstName);
    const lastName = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.lastName);
    const address = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.address);
    const city = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.city);
    const state = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.state);
    const zipCode = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.zipCode);
    const apt = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.apt);
    const availableStates = useAppSelector((state) => state.newSubmission.step03Data?.availableStatesList);
    const phoneNumber = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.phoneNumber);

    const [isCardDataValid, setIsCardDataValid] = useState(false);
    const [isAddressDataValid, setIsAddressDataValid] = useState(false);

    useEffect(() => {
        schema
            .isValid({
                firstName,
                lastName,
                address,
                apt,
                city,
                state,
                zipCode,
                phoneNumber,
            })
            .then((valid) => {
                setIsAddressDataValid(valid);
            });
    }, [firstName, lastName, address, apt, city, state, zipCode, phoneNumber]);

    useEffect(() => {
        if (useBillingAddressSameAsShipping) {
            dispatch(setBillingAddressEqualToShippingAddress());
        }
    }, [dispatch, useBillingAddressSameAsShipping]);

    function onSaveCardForLater() {
        dispatch(setSaveCardForLater(!saveCardForLater));
    }

    function onUseShippingAddressAsBilling() {
        dispatch(setUseShippingAddressAsBilling(!useBillingAddressSameAsShipping));
    }

    function updateCardData(fieldName: string, newValue: any) {
        dispatch(updatePaymentMethodField({ fieldName, newValue }));
    }

    function updateField(fieldName: any, newValue: any) {
        dispatch(updateBillingAddressField({ fieldName, newValue }));
    }

    function updateBillingState(stateId: number) {
        const stateLookup = availableStates.find((state) => state.id === stateId);
        if (stateLookup) {
            dispatch(
                updateBillingAddressField({
                    fieldName: 'state',
                    newValue: { name: stateLookup.name, id: stateLookup.id, code: stateLookup.code },
                }),
            );
        }
    }

    useEffect(() => {
        dispatch(setIsNextDisabled(true));
        if (paymentMethodId == 0) {
            if (isCardDataValid && isAddressDataValid) {
                dispatch(setIsNextDisabled(false));
            } else {
                dispatch(setIsNextDisabled(true));
            }
        }

        if (paymentMethodId == 1) {
            if (isAddressDataValid) {
                dispatch(setIsNextDisabled(false));
            } else {
                dispatch(setIsNextDisabled(true));
            }
        }
    }, [dispatch, isAddressDataValid, isCardDataValid, paymentMethodId]);

    useEffect(() => {
        const isNumberValid = CardValidator.number(cardNumber).isValid;
        const isCvvValid = CardValidator.cvv(cvv).isValid;
        const isExpirationValid = CardValidator.expirationDate(expirationDate).isValid;

        if (isNumberValid && isCvvValid && isExpirationValid) {
            setIsCardDataValid(true);
        } else {
            setIsCardDataValid(false);
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
                        {paymentMethodId === 0 ? (
                            <>
                                <div className={classes.sectionContainer}>
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
                                            <Typography className={classes.methodDescription}>
                                                Expiration Date
                                            </Typography>

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
                                    {useBillingAddressSameAsShipping ? (
                                        <>
                                            <Typography className={classes.billingAddressTitle}>
                                                Billing Address
                                            </Typography>
                                            <Typography
                                                className={classes.billingAddressItem}
                                            >{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</Typography>
                                            <Typography className={classes.billingAddressItem}>{`${
                                                shippingAddress.address
                                            } ${
                                                shippingAddress?.apt ? `apt: ${shippingAddress.apt}` : null
                                            }`}</Typography>
                                            <Typography
                                                className={classes.billingAddressItem}
                                            >{`${shippingAddress.city}, ${shippingAddress.state.name} ${shippingAddress.zipCode}, US`}</Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Divider light />
                                            <div className={classes.sectionContainer}>
                                                <div className={classes.shippingAddressSectionHeader}>
                                                    <Typography className={classes.sectionLabel}>
                                                        Billing Address
                                                    </Typography>
                                                </div>

                                                <div className={classes.inputsRow01}>
                                                    <div className={classes.fieldContainer} style={{ width: '47%' }}>
                                                        <Typography className={classes.methodDescription}>
                                                            First Name
                                                        </Typography>
                                                        <TextField
                                                            style={{ margin: 8, marginLeft: 0 }}
                                                            placeholder="Enter First Name"
                                                            value={firstName}
                                                            onChange={(e: any) =>
                                                                updateField('firstName', e.target.value)
                                                            }
                                                            fullWidth
                                                            size={'small'}
                                                            variant={'outlined'}
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </div>
                                                    <div className={classes.fieldContainer} style={{ width: '47%' }}>
                                                        <Typography className={classes.methodDescription}>
                                                            Last Name
                                                        </Typography>
                                                        <TextField
                                                            style={{ margin: 8, marginLeft: 0 }}
                                                            placeholder="Enter Last Name"
                                                            value={lastName}
                                                            onChange={(e: any) =>
                                                                updateField('lastName', e.target.value)
                                                            }
                                                            fullWidth
                                                            size={'small'}
                                                            variant={'outlined'}
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className={classes.inputsRow02}>
                                                    <div className={classes.fieldContainer} style={{ width: '80%' }}>
                                                        <Typography className={classes.methodDescription}>
                                                            Address
                                                        </Typography>
                                                        <TextField
                                                            style={{ margin: 8, marginLeft: 0 }}
                                                            placeholder="Enter Street Address"
                                                            fullWidth
                                                            value={address}
                                                            onChange={(e: any) =>
                                                                updateField('address', e.target.value)
                                                            }
                                                            size={'small'}
                                                            variant={'outlined'}
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={classes.fieldContainer}
                                                        style={{ width: '18%', marginTop: '4px' }}
                                                    >
                                                        <Typography className={classes.methodDescription}>
                                                            Apt # (optional)
                                                        </Typography>
                                                        <TextField
                                                            style={{ margin: 8, marginLeft: 0 }}
                                                            placeholder="Apt #"
                                                            fullWidth
                                                            value={apt}
                                                            onChange={(e: any) => updateField('apt', e.target.value)}
                                                            size={'small'}
                                                            variant={'outlined'}
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className={classes.inputsRow03}>
                                                    <div className={classes.fieldContainer} style={{ width: '30%' }}>
                                                        <Typography className={classes.methodDescription}>
                                                            City
                                                        </Typography>
                                                        <TextField
                                                            style={{ margin: 8, marginLeft: 0 }}
                                                            value={city}
                                                            onChange={(e: any) => updateField('city', e.target.value)}
                                                            placeholder="Enter City"
                                                            fullWidth
                                                            size={'small'}
                                                            variant={'outlined'}
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={classes.fieldContainer}
                                                        style={{ width: '32%', marginTop: '4px' }}
                                                    >
                                                        <Typography className={classes.methodDescription}>
                                                            State
                                                        </Typography>
                                                        <Select
                                                            fullWidth
                                                            value={state.id || 'none'}
                                                            onChange={(e: any) => updateBillingState(e.target.value)}
                                                            placeholder={'Select State'}
                                                            variant={'outlined'}
                                                            style={{ height: '43px' }}
                                                        >
                                                            <MenuItem value="none">Select a state</MenuItem>
                                                            {availableStates.map((item, index) => (
                                                                <MenuItem key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <div className={classes.fieldContainer} style={{ width: '32%' }}>
                                                        <Typography className={classes.methodDescription}>
                                                            Zip Code
                                                        </Typography>
                                                        <TextField
                                                            style={{ margin: 8, marginLeft: 0 }}
                                                            placeholder="Enter Zip Code"
                                                            fullWidth
                                                            value={zipCode}
                                                            onChange={(e: any) =>
                                                                updateField('zipCode', e.target.value)
                                                            }
                                                            size={'small'}
                                                            variant={'outlined'}
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className={classes.sectionContainer}>
                                <Typography className={classes.sectionLabel}>Paypal</Typography>
                                <Typography variant={'subtitle2'}>
                                    You will be redirected to the PayPal site after reviewing your order.{' '}
                                </Typography>
                            </div>
                        )}
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

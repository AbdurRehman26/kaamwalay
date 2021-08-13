import { NativeSelect } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';

import { PaymentForm } from '@dashboard/components/PaymentForm';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    setBillingAddress,
    setIsNextDisabled,
    setUseShippingAddressAsBilling,
    updateBillingAddressField,
} from '../redux/slices/newSubmissionSlice';
import PaymentMethodItem from './PaymentMethodItem';
import StepDescription from './StepDescription';
import SubmissionSummary from './SubmissionSummary';

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
    const currentSelectedStripeCardId = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.id);

    const useBillingAddressSameAsShipping = useAppSelector(
        (state) => state.newSubmission.step04Data.useShippingAddressAsBillingAddress,
    );
    const shippingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress);
    const existingAddresses = useAppSelector((state) => state.newSubmission.step03Data.existingAddresses);
    const selectedExistingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedExistingAddress);
    const useCustomShippingAddress = useAppSelector((state) => state.newSubmission.step03Data.useCustomShippingAddress);
    const firstName = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.firstName);
    const lastName = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.lastName);
    const address = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.address);
    const city = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.city);
    const state = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.state);
    const zipCode = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.zipCode);
    const apt = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.flat);
    const availableStates = useAppSelector((state) => state.newSubmission.step03Data?.availableStatesList);
    const phoneNumber = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.phoneNumber);

    const [isAddressDataValid, setIsAddressDataValid] = useState(false);
    const finalShippingAddress =
        existingAddresses.length !== 0 && !useCustomShippingAddress && selectedExistingAddress.id !== 0
            ? selectedExistingAddress
            : shippingAddress;

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
    }, [
        firstName,
        lastName,
        address,
        apt,
        city,
        state,
        zipCode,
        phoneNumber,
        selectedExistingAddress,
        useCustomShippingAddress,
        existingAddresses,
        useBillingAddressSameAsShipping,
    ]);

    const onUseShippingAddressAsBilling = useCallback(() => {
        dispatch(setUseShippingAddressAsBilling(!useBillingAddressSameAsShipping));
        if (!useBillingAddressSameAsShipping) {
            dispatch(setBillingAddress(finalShippingAddress));
        }
    }, [useBillingAddressSameAsShipping]);

    const updateField = useCallback((fieldName: any, newValue: any) => {
        dispatch(updateBillingAddressField({ fieldName, newValue }));
    }, []);

    const updateBillingState = useCallback((stateId: any) => {
        const stateLookup = availableStates.find((state) => state.id == stateId);
        if (stateLookup) {
            dispatch(
                updateBillingAddressField({
                    fieldName: 'state',
                    newValue: { name: stateLookup.name, id: stateLookup.id, code: stateLookup.code },
                }),
            );
        }
    }, []);

    useEffect(() => {
        dispatch(setIsNextDisabled(true));
        if (paymentMethodId == 1) {
            dispatch(setIsNextDisabled(currentSelectedStripeCardId.length === 0 || !isAddressDataValid));
        }

        if (paymentMethodId == 2) {
            dispatch(setIsNextDisabled(false));
        }
    }, [dispatch, isAddressDataValid, paymentMethodId, useBillingAddressSameAsShipping, currentSelectedStripeCardId]);

    useEffect(() => {
        if (useBillingAddressSameAsShipping) {
            dispatch(setBillingAddress(finalShippingAddress));
        }
    }, [dispatch]);
    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title={`Enter Payment Details`}
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
                                    isSelected={paymentMethodId === 1}
                                    methodName={'Credit or Debit Card'}
                                    methodId={1}
                                />
                                <PaymentMethodItem
                                    isSelected={paymentMethodId === 2}
                                    methodName={'Paypal'}
                                    methodId={2}
                                />
                            </div>
                        </div>
                        <Divider light />
                        {paymentMethodId === 1 ? (
                            <>
                                <div className={classes.sectionContainer}>
                                    <PaymentForm />
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
                                            >{`${finalShippingAddress.firstName} ${finalShippingAddress.lastName}`}</Typography>
                                            <Typography className={classes.billingAddressItem}>{`${
                                                finalShippingAddress.address
                                            } ${
                                                finalShippingAddress?.flat ? `apt: ${finalShippingAddress.flat}` : ''
                                            }`}</Typography>
                                            <Typography
                                                className={classes.billingAddressItem}
                                            >{`${finalShippingAddress.city}, ${finalShippingAddress.state.code} ${finalShippingAddress.zipCode}, US`}</Typography>
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
                                                    <div className={classes.fieldContainer} style={{ width: '18%' }}>
                                                        <Typography className={classes.methodDescription}>
                                                            Apt # (optional)
                                                        </Typography>
                                                        <TextField
                                                            style={{ margin: 8, marginLeft: 0 }}
                                                            placeholder="Apt #"
                                                            fullWidth
                                                            value={apt}
                                                            onChange={(e: any) => updateField('flat', e.target.value)}
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
                                                        style={{ width: '32%', marginTop: '6px' }}
                                                    >
                                                        <Typography className={classes.methodDescription}>
                                                            State
                                                        </Typography>
                                                        <Select
                                                            fullWidth
                                                            native
                                                            value={state.id || 'none'}
                                                            onChange={(e: any) =>
                                                                updateBillingState(e.nativeEvent.target.value)
                                                            }
                                                            placeholder={'Select State'}
                                                            variant={'outlined'}
                                                            style={{ height: '43px' }}
                                                        >
                                                            <option value="none">Select a state</option>
                                                            {availableStates.map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.code}
                                                                </option>
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

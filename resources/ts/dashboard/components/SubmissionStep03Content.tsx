import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import NumberFormat from 'react-number-format';
import * as yup from 'yup';
import ExistingAddress from '@dashboard/components/ExistingAddress';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    getStatesList,
    resetSelectedExistingAddress,
    setDisableAllShippingInputs,
    setIsNextDisabled,
    setSaveShippingAddress,
    setSelectedExistingAddress,
    setUseCustomShippingAddress,
    updateShippingAddressField,
} from '../redux/slices/newSubmissionSlice';
import StepDescription from './StepDescription';
import SubmissionSummary from './SubmissionSummary';

const useStyles = makeStyles((theme) => ({
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
        flexDirection: 'column',
    },
    shippingAddressSectionHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
    existingAddressesContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '32px',
        flexWrap: 'wrap',
    },
    newAddressCheckbox: {},
    allInputsContainer: {
        opacity: ({ disableAllInputs }: any) => (disableAllInputs ? '0.40' : 1),
    },
    addressFieldContainer: {
        width: '80%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    cityFieldContainer: {
        width: '30%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    stateFieldContainer: {
        width: '32%',
        marginTop: '6px',
        [theme.breakpoints.down('sm')]: {
            width: '47%',
        },
    },
    zipFieldContainer: {
        width: '32%',
        [theme.breakpoints.down('sm')]: {
            width: '47%',
        },
    },
    aptFieldContainer: {
        width: '18%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
}));

// TODO: Fix duplication
const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    address: yup.string().required(),
    flat: yup.string().optional(),
    city: yup.string().required(),
    state: yup.object().shape({
        name: yup.string().required(),
        id: yup.number().required(),
    }),
    zipCode: yup.string().required(),
    phoneNumber: yup.string().required(),
});

export function SubmissionStep03Content() {
    const disableAllInputs = useAppSelector((state) => state.newSubmission.step03Data.disableAllShippingInputs);
    const classes = useStyles({ disableAllInputs });
    const dispatch = useAppDispatch();
    const saveForLater = useAppSelector((state) => state.newSubmission.step03Data.saveForLater);

    const selectedExistingAddressId = useAppSelector(
        (state) => state.newSubmission.step03Data.selectedExistingAddress.id,
    );
    const useCustomShippingAddress = useAppSelector((state) => state.newSubmission.step03Data.useCustomShippingAddress);
    const existingAddresses = useAppSelector((state) => state.newSubmission.step03Data.existingAddresses);
    const firstName = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.firstName);
    const lastName = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.lastName);
    const address = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.address);
    const flat = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.flat);
    const city = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.city);
    const state = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.state);
    const zipCode = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.zipCode);
    const phoneNumber = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.phoneNumber);
    const availableStates = useAppSelector((state) => state.newSubmission.step03Data?.availableStatesList);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    useEffect(
        () => {
            if (existingAddresses.length === 0) {
                schema
                    .isValid({
                        firstName,
                        lastName,
                        address,
                        flat,
                        city,
                        state,
                        zipCode,
                        phoneNumber,
                    })
                    .then((valid) => {
                        dispatch(setIsNextDisabled(!valid));
                    });
            }

            if (existingAddresses.length !== 0 && useCustomShippingAddress) {
                schema
                    .isValid({
                        firstName,
                        lastName,
                        address,
                        flat,
                        city,
                        state,
                        zipCode,
                        phoneNumber,
                    })
                    .then((valid) => {
                        dispatch(setIsNextDisabled(!valid));
                    });
            }

            if (existingAddresses.length !== 0 && !useCustomShippingAddress && selectedExistingAddressId !== -1) {
                dispatch(setIsNextDisabled(false));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            firstName,
            lastName,
            address,
            flat,
            city,
            state,
            zipCode,
            phoneNumber,
            useCustomShippingAddress,
            selectedExistingAddressId,
            existingAddresses,
        ],
    );

    function onSaveForLater() {
        dispatch(setSaveShippingAddress(!saveForLater));
    }

    function updateField(fieldName: any, newValue: any) {
        dispatch(updateShippingAddressField({ fieldName, newValue }));
    }

    function handleUseCustomShippingAddress() {
        dispatch(setUseCustomShippingAddress(!useCustomShippingAddress));
        dispatch(setDisableAllShippingInputs(useCustomShippingAddress));

        // If the user is about to disable the checkbox, we'll select the first existing address on the list
        if (useCustomShippingAddress) {
            dispatch(setSelectedExistingAddress(existingAddresses[0].id));
        }
    }

    function updateShippingState(stateId: any) {
        const stateLookup = availableStates.find((state: any) => state.id === parseInt(stateId));
        if (stateLookup) {
            dispatch(
                updateShippingAddressField({
                    fieldName: 'state',
                    newValue: { name: stateLookup.name, id: stateLookup.id, code: stateLookup.code },
                }),
            );
        }
    }

    useEffect(
        () => {
            dispatch(getStatesList());
            // If the user has existing addresses but none of them is selected and he didn't pick a custom address either
            // we'll check the first address in the list
            if (existingAddresses.length !== 0 && selectedExistingAddressId === -1 && !useCustomShippingAddress) {
                dispatch(setSelectedExistingAddress(existingAddresses[0].id));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch],
    );

    useEffect(
        () => {
            // Did the user check the 'Use custom address" checkbox?
            // If he did select it, we'll enable all the text fields and clear everything about the existing selected address
            // If he didn't check the checkbox and he has multiple saved addresses we'll disable all the inputs until he presses on the checkbox
            // We only disable the inputs if the user has existing addresses so we don't stop him from adding an address as a first time user, when he has nothing.

            if (useCustomShippingAddress) {
                dispatch(setDisableAllShippingInputs(false));
                dispatch(resetSelectedExistingAddress());
            } else {
                if (existingAddresses.length !== 0) {
                    dispatch(setDisableAllShippingInputs(true));
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [disableAllInputs, useCustomShippingAddress, selectedExistingAddressId],
    );

    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title="Enter shipping details"
                    description={
                        <div style={{ maxWidth: '342px' }}>
                            Select your preferred return shipping method and enter your return shipping address
                        </div>
                    }
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        {existingAddresses.length > 0 ? (
                            <>
                                <Typography className={classes.sectionLabel}>Existing Addresses</Typography>
                                <Box marginBottom={'16px'} />
                                <div className={classes.existingAddressesContainer}>
                                    {existingAddresses?.map((address: any) => (
                                        <ExistingAddress
                                            key={address.id}
                                            firstName={address.firstName}
                                            lastName={address.lastName}
                                            address={address.address}
                                            flat={address.flat ?? ''}
                                            city={address.city}
                                            state={address.state.code}
                                            id={address.id}
                                            zip={address.zipCode}
                                        />
                                    ))}
                                </div>
                                <Divider light />
                            </>
                        ) : null}

                        <div className={classes.shippingAddressContainer}>
                            <div className={classes.shippingAddressSectionHeader}>
                                <Box>
                                    {existingAddresses.length > 0 ? (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={useCustomShippingAddress}
                                                    onChange={handleUseCustomShippingAddress}
                                                    name="checkedB"
                                                    color="primary"
                                                />
                                            }
                                            className={classes.newAddressCheckbox}
                                            label="Use a new address"
                                        />
                                    ) : null}
                                </Box>
                            </div>

                            <div className={classes.allInputsContainer}>
                                <div className={classes.shippingAddressSectionHeader}>
                                    <Typography className={classes.sectionLabel}>
                                        {existingAddresses.length > 0 ? 'New Shipping Address' : 'Shipping Address'}
                                    </Typography>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color={'primary'}
                                                checked={saveForLater}
                                                disabled={disableAllInputs}
                                                onChange={onSaveForLater}
                                            />
                                        }
                                        label="Save for later"
                                    />
                                </div>
                                <Box marginBottom={'16px'} />
                                <div className={classes.inputsRow01}>
                                    <div className={classes.fieldContainer} style={{ width: '47%' }}>
                                        <Typography className={classes.methodDescription}>First Name</Typography>
                                        <TextField
                                            style={{ margin: 8, marginLeft: 0 }}
                                            placeholder="Enter First Name"
                                            disabled={disableAllInputs}
                                            value={firstName}
                                            onChange={(e: any) => updateField('firstName', e.target.value)}
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
                                        <Typography className={classes.methodDescription}>Last Name</Typography>
                                        <TextField
                                            style={{ margin: 8, marginLeft: 0 }}
                                            placeholder="Enter Last Name"
                                            disabled={disableAllInputs}
                                            value={lastName}
                                            onChange={(e: any) => updateField('lastName', e.target.value)}
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
                                    <div className={`${classes.fieldContainer} ${classes.addressFieldContainer}`}>
                                        <Typography className={classes.methodDescription}>Address</Typography>
                                        <TextField
                                            style={{ margin: 8, marginLeft: 0 }}
                                            placeholder="Enter Street Address"
                                            fullWidth
                                            disabled={disableAllInputs}
                                            value={address}
                                            onChange={(e: any) => updateField('address', e.target.value)}
                                            size={'small'}
                                            variant={'outlined'}
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                    {!isMobile ? (
                                        <div className={`${classes.fieldContainer} ${classes.aptFieldContainer}`}>
                                            <Typography className={classes.methodDescription}>
                                                Apt # (optional)
                                            </Typography>
                                            <TextField
                                                style={{ margin: 8, marginLeft: 0 }}
                                                placeholder="Apt #"
                                                fullWidth
                                                disabled={disableAllInputs}
                                                value={flat}
                                                onChange={(e: any) => updateField('flat', e.target.value)}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    ) : null}
                                </div>

                                <div className={classes.inputsRow02}>
                                    {isMobile ? (
                                        <div className={`${classes.fieldContainer} ${classes.aptFieldContainer}`}>
                                            <Typography className={classes.methodDescription}>
                                                Apt # (optional)
                                            </Typography>
                                            <TextField
                                                style={{ margin: 8, marginLeft: 0 }}
                                                placeholder="Apt #"
                                                fullWidth
                                                disabled={disableAllInputs}
                                                value={flat}
                                                onChange={(e: any) => updateField('flat', e.target.value)}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    ) : null}
                                </div>

                                {isMobile ? (
                                    <div className={classes.inputsRow03}>
                                        <div className={`${classes.fieldContainer} ${classes.cityFieldContainer}`}>
                                            <Typography className={classes.methodDescription}>City</Typography>
                                            <TextField
                                                style={{ margin: 8, marginLeft: 0 }}
                                                value={city}
                                                onChange={(e: any) => updateField('city', e.target.value)}
                                                placeholder="Enter City"
                                                fullWidth
                                                disabled={disableAllInputs}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : null}

                                <div className={classes.inputsRow03}>
                                    {!isMobile ? (
                                        <div className={` ${classes.cityFieldContainer} ${classes.fieldContainer}`}>
                                            <Typography className={classes.methodDescription}>City</Typography>
                                            <TextField
                                                style={{ margin: 8, marginLeft: 0 }}
                                                value={city}
                                                onChange={(e: any) => updateField('city', e.target.value)}
                                                placeholder="Enter City"
                                                fullWidth
                                                disabled={disableAllInputs}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    ) : null}

                                    <div className={`${classes.fieldContainer} ${classes.stateFieldContainer}`}>
                                        <Typography className={classes.methodDescription}>State</Typography>
                                        <Select
                                            fullWidth
                                            native
                                            disabled={disableAllInputs}
                                            value={state.id || 'none'}
                                            onChange={(e: any) => updateShippingState(e.nativeEvent.target.value)}
                                            placeholder={'Select State'}
                                            variant={'outlined'}
                                            style={{ height: '43px' }}
                                        >
                                            <option value="none">Select a state</option>
                                            {availableStates.map((item: any) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.code}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className={`${classes.fieldContainer} ${classes.zipFieldContainer}`}>
                                        <Typography className={classes.methodDescription}>Zip Code</Typography>
                                        <TextField
                                            style={{ margin: 8, marginLeft: 0 }}
                                            placeholder="Enter Zip Code"
                                            fullWidth
                                            disabled={disableAllInputs}
                                            value={zipCode}
                                            onChange={(e: any) => updateField('zipCode', e.target.value)}
                                            size={'small'}
                                            variant={'outlined'}
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={classes.inputsRow04}>
                                    <div className={classes.fieldContainer} style={{ width: '100%', marginTop: '4px' }}>
                                        <Typography className={classes.methodDescription}>Phone Number</Typography>
                                        <NumberFormat
                                            customInput={TextField}
                                            format="+1 (###) ###-####"
                                            mask=""
                                            style={{ margin: 8, marginLeft: 0 }}
                                            placeholder="Enter Phone Number"
                                            value={phoneNumber}
                                            onChange={(e: any) => updateField('phoneNumber', e.target.value)}
                                            fullWidth
                                            disabled={disableAllInputs}
                                            variant={'outlined'}
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SubmissionSummary />
                </Grid>
            </Grid>
        </Container>
    );
}

export default SubmissionStep03Content;

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useAuth } from '@shared/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    getCountriesList,
    getSavedAddresses,
    getStatesList,
    resetSelectedExistingAddress,
    setDisableAllShippingInputs,
    setIsNextDisabled,
    setSaveShippingAddress,
    setSelectedExistingAddress,
    setUseCustomShippingAddress,
    updateShippingAddressField,
} from '../../redux/slices/newSubmissionSlice';
import ExistingAddress from '../ExistingAddress';
import { addressValidationSchema } from './addressValidationSchema';

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

export function InsuredShippingMethod() {
    const { authenticated } = useAuth();
    const dispatch = useAppDispatch();
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

    const disableAllInputs = useAppSelector((state) => state.newSubmission.step03Data.disableAllShippingInputs);
    const saveForLater = useAppSelector((state) => state.newSubmission.step03Data.saveForLater);

    const selectedExistingAddressId = useAppSelector(
        (state) => state.newSubmission.step03Data.selectedExistingAddress.id,
    );
    const useCustomShippingAddress = useAppSelector((state) => state.newSubmission.step03Data.useCustomShippingAddress);
    const existingAddresses = useAppSelector((state) => state.newSubmission.step03Data.existingAddresses);
    const fullName = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.fullName);
    const address = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.address);
    const otherAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.otherAddress);
    const city = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.city);
    const state = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.state);
    const stateName = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.stateName);
    const zipCode = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.zipCode);
    const country = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.country);
    const phoneNumber = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.phoneNumber);
    const availableStates = useAppSelector((state) => state.newSubmission.step03Data?.availableStatesList);
    const availableCountries = useAppSelector((state) => state.newSubmission.step03Data?.availableCountriesList);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const classes = useStyles({ disableAllInputs });

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
                    newValue: { name: stateLookup.name, id: stateLookup.id, code: stateLookup?.code },
                }),
            );
        }
    }

    function updateShippingCountry(countryId: any) {
        const country = availableCountries.find((country: any) => country.id === parseInt(countryId));
        if (country) {
            dispatch(
                updateShippingAddressField({
                    fieldName: 'country',
                    newValue: { name: country.name, id: country.id, code: country?.code },
                }),
            );
            dispatch(getStatesList({ countryId }));
        }
    }

    useEffect(
        () => {
            if (existingAddresses.length === 0 || useCustomShippingAddress) {
                addressValidationSchema
                    .isValid({
                        fullName,
                        address,
                        otherAddress,
                        country,
                        city,
                        stateName,
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
            fullName,
            address,
            otherAddress,
            country,
            city,
            stateName,
            state,
            zipCode,
            phoneNumber,
            useCustomShippingAddress,
            selectedExistingAddressId,
            existingAddresses,
        ],
    );

    useEffect(
        () => {
            dispatch(getStatesList());
            // If the user has existing addresses but none of them is selected and he didn't pick a custom address either
            // we'll check the first address in the list
            if (existingAddresses.length !== 0 && selectedExistingAddressId === -1 && !useCustomShippingAddress) {
                dispatch(setSelectedExistingAddress(existingAddresses[0].id));
            }
            if (!authenticated) {
                dispatch(setDisableAllShippingInputs(false));
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

    useEffect(
        () => {
            (async () => {
                try {
                    setIsLoadingAddresses(true);

                    await dispatch(getStatesList());
                    await dispatch(getCountriesList());
                    await dispatch(getSavedAddresses());
                } finally {
                    setIsLoadingAddresses(false);
                }
            })();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <div className={classes.leftSideContainer}>
            {isLoadingAddresses ? (
                <Grid container alignItems={'center'} justifyContent={'center'} p={3}>
                    <CircularProgress />
                </Grid>
            ) : null}
            {existingAddresses.length > 0 ? (
                <>
                    <Typography className={classes.sectionLabel}>Existing Addresses</Typography>
                    <Box marginBottom={'16px'} />
                    <div className={classes.existingAddressesContainer}>
                        {existingAddresses?.map((address: any) => (
                            <ExistingAddress
                                key={address.id}
                                fullName={address.firstName}
                                address={address.address}
                                otherAddress={address.otherAddress ?? ''}
                                flat={address.flat ?? ''}
                                city={address.city}
                                state={address.state?.code}
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
                    <div className={classes.inputsRow01}>
                        <div className={classes.fieldContainer} style={{ width: '100%' }}>
                            <Typography className={classes.methodDescription}>Country</Typography>
                            <Select
                                fullWidth
                                native
                                key={country.id ? country.id : availableCountries[0].id}
                                defaultValue={country.id ? country.id : availableCountries[0].id}
                                disabled={disableAllInputs}
                                onChange={(e: any) => updateShippingCountry(e.nativeEvent.target.value)}
                                placeholder={'Select Country'}
                                variant={'outlined'}
                                style={{ height: '43px', marginTop: 6 }}
                            >
                                <option value="none">Select a country</option>
                                {availableCountries.map((item: any) => (
                                    <option key={item.id} value={item.id}>
                                        {item?.code}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <Box marginBottom={'16px'} />
                    <div className={classes.inputsRow02}>
                        <div className={classes.fieldContainer} style={{ width: '100%' }}>
                            <Typography className={classes.methodDescription}>Full Name</Typography>
                            <TextField
                                style={{ margin: 8, marginLeft: 0 }}
                                placeholder="Enter Full Name"
                                disabled={disableAllInputs}
                                value={fullName}
                                onChange={(e: any) => updateField('fullName', e.target.value)}
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
                        <div
                            className={`${classes.fieldContainer} ${classes.addressFieldContainer}`}
                            style={{ width: '100%' }}
                        >
                            <Typography className={classes.methodDescription}>Address Line #1</Typography>
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
                    </div>

                    <div className={classes.inputsRow02}>
                        <div
                            className={`${classes.fieldContainer} ${classes.addressFieldContainer}`}
                            style={{ width: '100%' }}
                        >
                            <Typography className={classes.methodDescription}>Address Line #2 (Optional)</Typography>
                            <TextField
                                style={{ margin: 8, marginLeft: 0 }}
                                placeholder="Enter apt, suite, building, floor etc."
                                fullWidth
                                disabled={disableAllInputs}
                                value={otherAddress}
                                onChange={(e: any) => updateField('otherAddress', e.target.value)}
                                size={'small'}
                                variant={'outlined'}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
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
                            {country.code === 'US' || country.code === '' ? (
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
                                            {item?.code}
                                        </option>
                                    ))}
                                </Select>
                            ) : (
                                <TextField
                                    style={{ marginTop: 2 }}
                                    placeholder="Enter State"
                                    fullWidth
                                    disabled={disableAllInputs}
                                    value={stateName}
                                    onChange={(e: any) => updateField('stateName', e.target.value)}
                                    size={'small'}
                                    variant={'outlined'}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
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
    );
}

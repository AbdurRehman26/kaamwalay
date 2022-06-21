import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useNotifications } from '@shared/hooks/useNotifications';
import { addressValidationSchema } from '@dashboard/components/SubmissionSteps/addressValidationSchema';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import {
    addNewShippingAddress,
    getStatesList,
    updateShippingAddress,
    updateShippingAddressField,
} from '../../redux/slices/newAddressSlice';

interface AddAddressDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle: string;
    isUpdate?: boolean;
    addressId?: number;
    onSubmit(): Promise<void> | void;
}

const useStyles = makeStyles((theme) => ({
    divider: {
        marginTop: '64px',
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
}));

export function AddAddressDialog(props: AddAddressDialogProps) {
    const { onClose, onSubmit, isUpdate, dialogTitle, addressId, ...rest } = props;
    const [isSaveBtnEnable, setIsSaveBtnEnable] = useState(false);

    const notifications = useNotifications();

    const fullName = useAppSelector((state) => state.newAddressSlice.shippingAddress.fullName);
    const address = useAppSelector((state) => state.newAddressSlice?.shippingAddress.address);
    const address2 = useAppSelector((state) => state.newAddressSlice?.shippingAddress.address2);
    const city = useAppSelector((state) => state.newAddressSlice?.shippingAddress.city);
    const state = useAppSelector((state) => state.newAddressSlice?.shippingAddress.state);
    const stateName = useAppSelector((state) => state.newAddressSlice?.shippingAddress.stateName);
    const zipCode = useAppSelector((state) => state.newAddressSlice?.shippingAddress.zip);
    const country = useAppSelector((state) => state.newAddressSlice?.shippingAddress.country);
    const phoneNumber = useAppSelector((state) => state.newAddressSlice?.shippingAddress.phone);
    const availableCountries = useAppSelector((state) => state.newAddressSlice.availableCountriesList);
    const availableStates = useAppSelector((state) => state.newAddressSlice?.availableStatesList);
    const dispatch = useAppDispatch();

    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const classes = useStyles({});

    // useEffect(
    //     () => {
    //         if (isUpdate) {
    //             dispatch(getSingleAddress(updateItem?.id));
    //         }
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [],
    // );

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    const handleAddressSubmit = useCallback(async () => {
        try {
            if (isUpdate) {
                dispatch(updateShippingAddress(addressId));
                if (onClose) {
                    (onClose as any)();
                    onSubmit();
                }
            } else {
                dispatch(addNewShippingAddress());
                if (onClose) {
                    (onClose as any)();
                    onSubmit();
                }
            }
        } catch (e: any) {
            notifications.exception(e);
        }
    }, [dispatch, isUpdate, addressId, notifications, onClose, onSubmit]);

    useEffect(
        () => {
            addressValidationSchema
                .isValid({
                    fullName,
                    address,
                    address2,
                    country,
                    city,
                    state,
                    zipCode,
                    phoneNumber,
                })
                .then((valid) => {
                    if (valid) {
                        console.log('valid !');
                        setIsSaveBtnEnable(true);
                    } else {
                        setIsSaveBtnEnable(false);
                    }
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fullName, address, address2, country, city, state, zipCode, phoneNumber],
    );

    function updateField(fieldName: any, newValue: any) {
        dispatch(updateShippingAddressField({ fieldName, newValue }));
    }

    function updateShippingCountry(countryId: any) {
        const country = availableCountries.find((country: any) => country.id === parseInt(countryId));
        if (country) {
            dispatch(
                updateShippingAddressField({
                    fieldName: 'country',
                    newValue: {
                        name: country.name,
                        id: country.id,
                        code: country?.code,
                        phoneCode: country?.phoneCode,
                    },
                }),
            );
            dispatch(
                updateShippingAddressField({
                    fieldName: 'state',
                    newValue: isUpdate ? null : {},
                }),
            );
            dispatch(
                updateShippingAddressField({
                    fieldName: 'stateName',
                    newValue: '',
                }),
            );
            dispatch(
                updateShippingAddressField({
                    fieldName: 'phone',
                    newValue: '',
                }),
            );
            dispatch(getStatesList({ countryId }));
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
            dispatch(
                updateShippingAddressField({
                    fieldName: 'stateName',
                    newValue: '',
                }),
            );
        }
    }

    return (
        <Dialog onClose={handleClose} {...rest}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <div className={classes.inputsRow01}>
                    <div className={classes.fieldContainer} style={{ width: '100%' }}>
                        <Typography className={classes.methodDescription}>Country</Typography>
                        <Select
                            fullWidth
                            native
                            key={country?.id ? country?.id : availableCountries[0]?.id}
                            defaultValue={country?.id ? country?.id : availableCountries[0]?.id}
                            onChange={(e: any) => updateShippingCountry(e.nativeEvent.target.value)}
                            placeholder={'Select Country'}
                            variant={'outlined'}
                            style={{ height: '43px', marginTop: 6 }}
                        >
                            <option value="none">Select a country</option>
                            {availableCountries.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item?.name}
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
                            value={address2}
                            onChange={(e: any) => updateField('address2', e.target.value)}
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
                        {country?.code === 'US' || country?.code === '' ? (
                            <Select
                                fullWidth
                                native
                                value={isUpdate ? state?.id : !isUpdate ? state?.id || 'none' : state}
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
                                value={isUpdate ? state : stateName}
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
                            value={zipCode}
                            onChange={(e: any) => updateField('zip', e.target.value)}
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
                            format={
                                country?.phoneCode
                                    ? '+' + country?.phoneCode + ' (###) ###-####'
                                    : '+' + availableCountries[0].phoneCode + ' (###) ###-####'
                            }
                            mask=""
                            style={{ margin: 8, marginLeft: 0 }}
                            placeholder="Enter Phone Number"
                            value={phoneNumber}
                            onChange={(e: any) => updateField('phone', e.target.value)}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button color="primary" disabled={!isSaveBtnEnable} onClick={handleAddressSubmit}>
                    {'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

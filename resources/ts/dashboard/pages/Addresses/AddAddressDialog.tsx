import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import { Theme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import {
    addNewShippingAddress,
    getCountriesList,
    getStatesList,
    updateShippingAddressField,
} from '../../redux/slices/newAddressSlice';

// import { addressValidationSchema } from '@dashboard/components/SubmissionSteps/addressValidationSchema'

interface AddPaymentCardDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle?: string;
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

export function AddAddressDialog(props: AddPaymentCardDialogProps) {
    const { onClose, onSubmit, ...rest } = props;
    // const [isSaveBtnLoading, setSaveBtnLoading] = useState(false);

    const fullName = useAppSelector((state) => state.newAddressSlice.shippingAddress.firstName);
    const address = useAppSelector((state) => state.newAddressSlice?.shippingAddress.address);
    const address2 = useAppSelector((state) => state.newAddressSlice?.shippingAddress.address2);
    const city = useAppSelector((state) => state.newAddressSlice?.shippingAddress.city);
    const state = useAppSelector((state) => state.newAddressSlice?.shippingAddress.state);
    const stateName = useAppSelector((state) => state.newAddressSlice?.shippingAddress.stateName);
    const zipCode = useAppSelector((state) => state.newAddressSlice?.shippingAddress.zipCode);
    const country = useAppSelector((state) => state.newAddressSlice?.shippingAddress.country);
    const phoneNumber = useAppSelector((state) => state.newAddressSlice?.shippingAddress.phoneNumber);
    const availableCountries = useAppSelector((state) => state.newAddressSlice.availableCountriesList);
    const availableStates = useAppSelector((state) => state.newAddressSlice?.availableStatesList);
    const dispatch = useAppDispatch();

    const classes = useStyles({});

    // const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    const handleAddressSubmit = useCallback(() => {
        console.log('submit ');
        dispatch(addNewShippingAddress());
    }, [dispatch]);

    useEffect(
        () => {
            dispatch(getCountriesList());
            dispatch(getStatesList());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // useEffect(
    //     () => {
    //             addressValidationSchema
    //                 .isValid({
    //                     fullName,
    //                     address,
    //                     address2,
    //                     country,
    //                     city,
    //                     state,
    //                     stateName,
    //                     zipCode,
    //                     phoneNumber,
    //                 })
    //                 .then((valid) => {
    //                     if (valid) {
    //                         setSaveBtnLoading(true)
    //                     }
    //                 });
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [
    //         fullName,
    //         address,
    //         address2,
    //         country,
    //         city,
    //         state,
    //         stateName,
    //         zipCode,
    //         phoneNumber,
    //     ],
    // );

    function updateField(fieldName: any, newValue: any) {
        dispatch(updateShippingAddressField({ fieldName, newValue }));
    }

    return (
        <Dialog onClose={handleClose} {...rest}>
            <DialogTitle>Add Shipping Address</DialogTitle>
            <DialogContent>
                <div className={classes.inputsRow01}>
                    <div className={classes.fieldContainer} style={{ width: '100%' }}>
                        <Typography className={classes.methodDescription}>Country</Typography>
                        <Select
                            fullWidth
                            native
                            key={country?.id ? country?.id : availableCountries[0]?.id}
                            defaultValue={country?.id ? country?.id : availableCountries[0]?.id}
                            onChange={(e: any) => updateField('country', e.target.value)}
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

                <div className={classes.inputsRow03}>
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

                    <div className={`${classes.fieldContainer} ${classes.stateFieldContainer}`}>
                        <Typography className={classes.methodDescription}>State</Typography>
                        {country?.code === 'US' || country?.code === '' ? (
                            <Select
                                fullWidth
                                native
                                value={state?.id || 'none'}
                                onChange={(e: any) => updateField('state', e.target.value)}
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
                            format={
                                country?.phoneCode
                                    ? '+' + country?.phoneCode + ' (###) ###-####'
                                    : '+' + availableCountries[0].phoneCode + ' (###) ###-####'
                            }
                            mask=""
                            style={{ margin: 8, marginLeft: 0 }}
                            placeholder="Enter Phone Number"
                            value={phoneNumber}
                            onChange={(e: any) => updateField('phoneNumber', e.target.value)}
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
                <Button color="primary" onClick={handleAddressSubmit}>
                    {'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

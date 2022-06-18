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
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getCountriesList, getStatesList } from '../../redux/slices/newSubmissionSlice';

interface AddPaymentCardDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle?: string;
    onSubmit(): Promise<void> | void;
}

interface CountryProps {
    id: string;
    name: string;
    code: string;
    phoneCode: string;
}
interface StateProps {
    id: string;
    name: string;
    code: string;
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
    const [isSaveBtnLoading, setSaveBtnLoading] = useState(false);
    const [country, setCountry] = useState<CountryProps>();
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState<StateProps | string>();
    const [zip, setZip] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const availableCountries = useAppSelector((state) => state.newSubmission.step03Data?.availableCountriesList);
    const availableStates = useAppSelector((state) => state.newSubmission.step03Data?.availableStatesList);
    const dispatch = useAppDispatch();

    const apiService = useInjectable(APIService);
    const classes = useStyles({});

    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const handleSubmit = useCallback(async () => {
        const endpoint = apiService.createEndpoint('customer/addresses');
        setSaveBtnLoading(true);
        const DTO = {
            country: country,
            fullName: fullName,
            address: address,
            address2: address2,
            state: state,
            city: city,
            zip: zip,
            phoneNumber: phoneNumber,
        };
        console.log('dto ', DTO);
        const addressResponse = await endpoint.post('', DTO);
        console.log('address ', addressResponse);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    useEffect(
        () => {
            (async () => {
                await dispatch(getCountriesList());
                await dispatch(getStatesList());
            })();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const handleCountryChange = () => setCountry(country);
    const handleFullNameChange = () => setFullName(fullName);
    const handleAddressChange = () => setAddress(address);
    const handleAddress2Change = () => setAddress2(address2);
    const handleCityChange = () => setCity(city);
    const handleStateChange = () => setState(state);
    const handleZipChange = () => setZip(zip);
    const handlePhoneChange = () => setPhoneNumber(phoneNumber);

    return (
        <Dialog onClose={handleClose} {...rest}>
            <DialogTitle>Add new Address</DialogTitle>
            <DialogContent>
                <div className={classes.inputsRow01}>
                    <div className={classes.fieldContainer} style={{ width: '100%' }}>
                        <Typography className={classes.methodDescription}>Country</Typography>
                        <Select
                            fullWidth
                            native
                            key={country?.id ? country?.id : availableCountries[0].id}
                            defaultValue={country?.id ? country?.id : availableCountries[0].id}
                            onChange={handleCountryChange}
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
                            onChange={handleFullNameChange}
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
                            onChange={handleAddressChange}
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
                            onChange={handleAddress2Change}
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
                                onChange={handleCityChange}
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
                                onChange={handleCityChange}
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
                                value={state || 'none'}
                                onChange={handleStateChange}
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
                                value={state}
                                onChange={handleStateChange}
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
                            value={zip}
                            onChange={handleZipChange}
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
                            onChange={handlePhoneChange}
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
                <Button color="primary" onClick={handleSubmit} disabled={isSaveBtnLoading}>
                    {isSaveBtnLoading ? 'Loading...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

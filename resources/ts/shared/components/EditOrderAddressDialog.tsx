import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NumberFormat from 'react-number-format';
import * as yup from 'yup';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { useAppSelector } from '@shared/hooks/useAppSelector';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { getCountriesList, getStatesList } from '@shared/redux/slices/addressEditSlice';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

type InitialValues = {
    countryId: string;
    fullName: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    phone: string;
    zip: string;
};
export interface EditOrderAddressDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle?: string;
    address?: AddressEntity;
    endpointUrl: string;
    endpointVersion: string;
    onSubmit(): Promise<void> | void;
}

const useStyles = makeStyles(
    (theme) => ({
        dialog: {
            padding: 1,
        },
        fullWidth: {
            width: '100%',
        },
        dialogTitle: {
            borderBottom: '1px solid #E0E0E0',
            padding: '1.25rem 1.5rem',
            lineHeight: '1.5rem',
        },
        dialogActions: {
            borderTop: '1px solid #E0E0E0',
            padding: '1.25rem 1.5rem',
        },
        formContainer: {
            padding: '2.25rem 1.5rem',
        },
        cancelButton: {
            padding: '14px 20px',
            lineHeight: '1.25rem',
            color: 'black',
        },
        submitButton: {
            padding: '14px 20px',
            lineHeight: '1.25rem',
        },
        formField: {
            margin: '0',
        },
        formInput: {
            padding: '14px 12px',
            lineHeight: '20px',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        inputTitle: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: '400',
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
            margin: '0px 0px 20px 0px',
        },
        cityFieldContainer: {
            width: '30%',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        stateFieldContainer: {
            width: '32%',
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
        inputsRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    }),
    { name: 'EditOrderAddressDialog' },
);

const schema = yup.object().shape({
    fullName: yup.string().required(),
    address: yup.string().required(),
    address2: yup.string().optional().nullable(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    countryId: yup.string().required(),
    phone: yup.string().optional().nullable(),
});

export const EditOrderAddressDialog = (props: EditOrderAddressDialogProps) => {
    const { onClose, onSubmit, dialogTitle, address, endpointUrl = '', endpointVersion = 'v2', ...rest } = props;
    const classes = useStyles();
    const availableCountries = useAppSelector((state) => state.addressEditSlice.availableCountriesList);
    const availableStates = useAppSelector((state) => state.addressEditSlice.availableStatesList);
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const apiService = useInjectable(APIService);

    const dispatch = useSharedDispatch();

    const [hasChanged, setHasChanged] = useState(false);

    const [currentValues, setCurrentValues] = useState<InitialValues>({
        countryId: address?.country?.id.toString() ?? '',
        fullName: address?.getFullName() ?? '',
        address: address?.address ?? '',
        address2: address?.address2 ?? '',
        city: address?.city ?? '',
        state: address?.state ?? '',
        phone: address?.phone ?? '',
        zip: address?.zip ?? '',
    });

    const initialValues = useMemo<InitialValues>(
        () => ({
            countryId: address?.country?.id.toString() ?? '',
            fullName: address?.getFullName() ?? '',
            address: address?.address ?? '',
            address2: address?.address2 ?? '',
            city: address?.city ?? '',
            state: address?.state ?? '',
            phone: address?.phone ?? '',
            zip: address?.zip ?? '',
        }),
        [address],
    );

    const handleClose = useCallback(() => {
        if (onClose) {
            (onClose as any)();
        }
    }, [onClose]);

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

    const getCountryCode = useCallback(
        (id: number) => {
            const countryLookup = availableCountries.find((country: any) => country.id === id);
            if (countryLookup) {
                return countryLookup.code;
            } else {
                return id;
            }
        },
        [availableCountries],
    );

    const getCountryPhoneCode = useCallback(
        (id: number) => {
            const countryLookup = availableCountries.find((country: any) => country.id === id);
            if (countryLookup) {
                return countryLookup.phoneCode;
            } else {
                return '';
            }
        },
        [availableCountries],
    );

    const parseName = (fullName: any) => {
        const value = fullName.trim();
        const firstSpace = value.indexOf(' ');
        if (firstSpace === -1) {
            return { firstName: value, lastName: null };
        }

        const firstName = value.slice(0, firstSpace);
        const lastName = value.slice(firstSpace + 1);

        return { firstName, lastName };
    };

    const updateCurrentValues = async (key: string, value: string) => {
        const updatedValues = {
            ...currentValues,
            [key]: value,
        };
        await setCurrentValues(updatedValues);

        checkChanges(updatedValues);
    };

    const checkChanges = (values: InitialValues) => {
        const initialKeys = Object.keys(initialValues);

        const objectsAreEqual = initialKeys.every((key) => {
            // @ts-ignore
            return initialValues[key] === values[key];
        });

        setHasChanged(!objectsAreEqual);
    };

    const handleEditAddress = async (values: InitialValues) => {
        const endpoint = apiService.createEndpoint(endpointUrl, { version: endpointVersion });
        const parsedName = parseName(values.fullName);

        setIsLoading(true);
        try {
            await endpoint.put('', {
                countryCode: getCountryCode(parseInt(values.countryId)),
                firstName: parsedName?.firstName,
                lastName: parsedName?.lastName,
                address: values.address,
                address2: values.address2,
                city: values.city,
                state: values.state,
                phone: values.phone,
                zip: values.zip,
            });
            NotificationsService.success('Address Updated successfully!');
            onSubmit();
        } catch (e: any) {
            NotificationsService.exception(e);
        }
        setIsLoading(false);
    };

    const closeIcon = (
        <IconButton
            sx={{
                position: 'absolute',
                right: 8,
                top: 13,
                color: 'black',
            }}
            onClick={handleClose}
        >
            <CloseIcon />
        </IconButton>
    );

    return (
        <>
            <Dialog onClose={handleClose} {...rest} fullWidth scroll={'body'}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleEditAddress}
                    validationSchema={schema}
                    validateOnChange={true}
                >
                    {({ values, handleChange, submitForm, errors, isValidating, setValues }) => (
                        <>
                            <DialogTitle className={classes.dialogTitle}>
                                {'Edit Address'}
                                {closeIcon}
                            </DialogTitle>
                            <DialogContent className={classes.dialog}>
                                <Box display={'flex'} flexDirection={'column'} className={classes.formContainer}>
                                    <div className={`${classes.fieldContainer} ${classes.fullWidth}`}>
                                        <Typography className={classes.inputTitle}>Country</Typography>
                                        <Select
                                            className={classes.formField}
                                            fullWidth
                                            native
                                            name={'countryId'}
                                            placeholder={'Select Country'}
                                            variant={'outlined'}
                                            value={values.countryId}
                                            onChange={(e) => {
                                                setValues({
                                                    ...values,
                                                    countryId: e.target.value,
                                                    phone: '',
                                                });
                                                updateCurrentValues('countryId', e.target.value);
                                            }}
                                            inputProps={{
                                                className: classes.formInput,
                                            }}
                                        >
                                            <option value="">Select a country</option>
                                            {availableCountries.map((item: any) => (
                                                <option key={item.id} value={item.id}>
                                                    {item?.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className={classes.inputsRow}>
                                        <div className={`${classes.fieldContainer} ${classes.fullWidth}`}>
                                            <Typography className={classes.inputTitle}>Full Name</Typography>
                                            <TextField
                                                className={classes.formField}
                                                placeholder="Enter Full Name"
                                                name={'fullName'}
                                                value={values.fullName}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    updateCurrentValues('fullName', e.target.value);
                                                }}
                                                fullWidth
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                inputProps={{
                                                    className: classes.formInput,
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={classes.inputsRow}>
                                        <div className={`${classes.fieldContainer} ${classes.fullWidth}`}>
                                            <Typography className={classes.inputTitle}>Address</Typography>
                                            <TextField
                                                className={classes.formField}
                                                placeholder="Enter Street Address"
                                                fullWidth
                                                name={'address'}
                                                value={values.address}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    updateCurrentValues('address', e.target.value);
                                                }}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                inputProps={{
                                                    className: classes.formInput,
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.inputsRow}>
                                        <div className={`${classes.fieldContainer} ${classes.fullWidth}`}>
                                            <Typography className={classes.inputTitle}>
                                                Address Line #2 (Optional)
                                            </Typography>
                                            <TextField
                                                className={classes.formField}
                                                placeholder="Enter apt, suite, building, floor etc."
                                                fullWidth
                                                name={'address2'}
                                                value={values.address2}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    updateCurrentValues('address2', e.target.value);
                                                }}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                inputProps={{
                                                    className: classes.formInput,
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {isMobile ? (
                                        <div className={classes.inputsRow}>
                                            <div className={`${classes.fieldContainer} ${classes.cityFieldContainer} `}>
                                                <Typography className={classes.inputTitle}>City</Typography>
                                                <TextField
                                                    className={classes.formField}
                                                    name={'city'}
                                                    value={values.city}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        updateCurrentValues('city', e.target.value);
                                                    }}
                                                    placeholder="Enter City"
                                                    fullWidth
                                                    size={'small'}
                                                    variant={'outlined'}
                                                    margin="normal"
                                                    inputProps={{
                                                        className: classes.formInput,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className={classes.inputsRow}>
                                        {!isMobile ? (
                                            <div className={`${classes.fieldContainer} ${classes.cityFieldContainer}`}>
                                                <Typography className={classes.inputTitle}>City</Typography>
                                                <TextField
                                                    className={classes.formField}
                                                    name={'city'}
                                                    value={values.city}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        updateCurrentValues('city', e.target.value);
                                                    }}
                                                    placeholder="Enter City"
                                                    fullWidth
                                                    size={'small'}
                                                    variant={'outlined'}
                                                    margin="normal"
                                                    inputProps={{
                                                        className: classes.formInput,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </div>
                                        ) : null}

                                        <div className={`${classes.fieldContainer} ${classes.stateFieldContainer}`}>
                                            <Typography className={classes.inputTitle}>State</Typography>
                                            {values.countryId === '1' || !values.countryId ? (
                                                <Select
                                                    className={classes.formField}
                                                    fullWidth
                                                    native
                                                    name={'state'}
                                                    value={values.state}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        updateCurrentValues('state', e.target.value);
                                                    }}
                                                    placeholder={'Select State'}
                                                    variant={'outlined'}
                                                    inputProps={{
                                                        className: classes.formInput,
                                                    }}
                                                >
                                                    <option value="">Select a state</option>
                                                    {availableStates.map((item: any) => (
                                                        <option key={item.id} value={item.code}>
                                                            {item?.code}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <TextField
                                                    className={classes.formField}
                                                    placeholder="Enter State"
                                                    fullWidth
                                                    value={values.state}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        updateCurrentValues('state', e.target.value);
                                                    }}
                                                    name={'state'}
                                                    size={'small'}
                                                    variant={'outlined'}
                                                    margin="normal"
                                                    inputProps={{
                                                        className: classes.formInput,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className={`${classes.fieldContainer} ${classes.zipFieldContainer}`}>
                                            <Typography className={classes.inputTitle}>Zip Code</Typography>
                                            <TextField
                                                className={classes.formField}
                                                placeholder="Enter Zip Code"
                                                fullWidth
                                                name={'zip'}
                                                value={values.zip}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    updateCurrentValues('zip', e.target.value);
                                                }}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                inputProps={{
                                                    className: classes.formInput,
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.inputsRow}>
                                        <div className={`${classes.fieldContainer} ${classes.fullWidth}`}>
                                            <Typography className={classes.inputTitle}>
                                                Phone Number (Optional)
                                            </Typography>
                                            <NumberFormat
                                                customInput={TextField}
                                                format={
                                                    values.countryId
                                                        ? '+' +
                                                          getCountryPhoneCode(parseInt(values.countryId)) +
                                                          ' (###) ###-####'
                                                        : '+' + availableCountries[0]?.phoneCode + ' (###) ###-####'
                                                }
                                                mask=""
                                                className={classes.formField}
                                                placeholder="Enter Phone Number"
                                                name={'phone'}
                                                value={values.phone}
                                                onChange={(e: { target: { value: string } }) => {
                                                    handleChange(e);
                                                    updateCurrentValues('phone', e.target.value);
                                                }}
                                                fullWidth
                                                inputProps={{
                                                    className: classes.formInput,
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Box>
                            </DialogContent>
                            <DialogActions className={classes.dialogActions}>
                                <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        justifyContent={'space-between'}
                                        minWidth={'150px'}
                                    >
                                        <Button variant="text" className={classes.cancelButton} onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color={'primary'}
                                            disabled={
                                                isValidating ||
                                                isLoading ||
                                                Object.keys(errors).length > 0 ||
                                                !hasChanged
                                            }
                                            onClick={submitForm}
                                            className={classes.submitButton}
                                        >
                                            {isValidating || isLoading ? (
                                                <CircularProgress color={'primary'} />
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </Button>
                                    </Box>
                                </Box>
                            </DialogActions>
                        </>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default EditOrderAddressDialog;

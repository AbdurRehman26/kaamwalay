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
        root: {},
        topDivider: {
            marginTop: theme.spacing(2),
        },
        swapButton: {
            marginTop: 19,
            height: 38,
        },
        dialog: {
            padding: 1,
        },
        label: {
            color: '#0000008A',
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
        addressFieldContainer: {
            width: '80%',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        aptFieldContainer: {
            width: '18%',
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
        const currentKeys = Object.keys(values);

        // @ts-ignore
        setHasChanged(
            !(
                initialKeys.length === currentKeys.length &&
                initialKeys.every((key) => initialValues[key] === values[key])
            ),
        );
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
                top: 8,
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
                    {({ values, handleChange, submitForm, errors, isValidating }) => (
                        <>
                            <DialogTitle>
                                {'Edit Address'}
                                {closeIcon}
                            </DialogTitle>
                            <DialogContent className={classes.dialog}>
                                <Box display={'flex'} flexDirection={'column'} padding={'12px'}>
                                    <div className={classes.fieldContainer} style={{ width: '100%' }}>
                                        <Typography className={classes.methodDescription}>
                                            Country {typeof values.countryId}
                                        </Typography>
                                        <Select
                                            fullWidth
                                            native
                                            name={'countryId'}
                                            placeholder={'Select Country'}
                                            variant={'outlined'}
                                            style={{ height: '43px', marginTop: 6 }}
                                            value={values.countryId}
                                            onChange={(e) => {
                                                handleChange(e);
                                                updateCurrentValues('countryId', e.target.value);
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
                                    <div className={classes.inputsRow02}>
                                        <div className={classes.fieldContainer} style={{ width: '100%' }}>
                                            <Typography className={classes.methodDescription}>Full Name</Typography>
                                            <TextField
                                                style={{ margin: 8, marginLeft: 0 }}
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
                                            <Typography className={classes.methodDescription}>Address</Typography>
                                            <TextField
                                                style={{ margin: 8, marginLeft: 0 }}
                                                placeholder="Enter Street Address"
                                                fullWidth
                                                name={'address'}
                                                value={values.address}
                                                onChange={handleChange}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={'inputsRow02'}>
                                        <div
                                            className={`${classes.fieldContainer} ${classes.addressFieldContainer}`}
                                            style={{ width: '100%' }}
                                        >
                                            <Typography className={classes.methodDescription}>
                                                Address Line #2 (Optional)
                                            </Typography>
                                            <TextField
                                                style={{ margin: 8, marginLeft: 0 }}
                                                placeholder="Enter apt, suite, building, floor etc."
                                                fullWidth
                                                name={'address2'}
                                                value={values.address2}
                                                onChange={handleChange}
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
                                            <div className={`${classes.fieldContainer} ${classes.cityFieldContainer} `}>
                                                <Typography className={classes.methodDescription}>City</Typography>
                                                <TextField
                                                    style={{ margin: 8, marginLeft: 0 }}
                                                    name={'city'}
                                                    value={values.city}
                                                    onChange={handleChange}
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
                                            <div className={`${classes.fieldContainer} ${classes.cityFieldContainer}`}>
                                                <Typography className={classes.methodDescription}>City</Typography>
                                                <TextField
                                                    style={{ margin: 8, marginLeft: 0 }}
                                                    name={'city'}
                                                    value={values.city}
                                                    onChange={handleChange}
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
                                            {values.countryId === '1' || !values.countryId ? (
                                                <Select
                                                    fullWidth
                                                    native
                                                    name={'state'}
                                                    value={values.state}
                                                    onChange={handleChange}
                                                    placeholder={'Select State'}
                                                    variant={'outlined'}
                                                    style={{ height: '43px' }}
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
                                                    style={{ marginTop: 2 }}
                                                    placeholder="Enter State"
                                                    fullWidth
                                                    value={values.state}
                                                    onChange={handleChange}
                                                    name={'state'}
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
                                                name={'zip'}
                                                value={values.zip}
                                                onChange={handleChange}
                                                size={'small'}
                                                variant={'outlined'}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={'inputsRow04'}>
                                        <div className={'fieldContainer'} style={{ width: '100%', marginTop: '4px' }}>
                                            <Typography className={classes.methodDescription}>
                                                Phone Number (Optional)
                                            </Typography>
                                            <NumberFormat
                                                customInput={TextField}
                                                format={
                                                    address?.country?.phoneCode
                                                        ? '+' + address?.country?.phoneCode + ' (###) ###-####'
                                                        : '+' + availableCountries[0]?.phoneCode + ' (###) #   ##-####'
                                                }
                                                mask=""
                                                style={{ margin: 8, marginLeft: 0 }}
                                                placeholder="Enter Phone Number"
                                                name={'phone'}
                                                value={values.phone}
                                                onChange={handleChange}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{ margin: '16px' }}>
                                <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        justifyContent={'space-between'}
                                        minWidth={'150px'}
                                        marginRight={'13px'}
                                    >
                                        <Button variant="text" sx={{ color: '#000' }} onClick={handleClose}>
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

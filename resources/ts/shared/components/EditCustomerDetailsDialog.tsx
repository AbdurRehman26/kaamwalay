import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import InternationalPhoneNumberField from '@shared/components/InternationalPhoneNumberField';
import { UserEntity } from '@shared/entities/UserEntity';
import { useAppSelector } from '@shared/hooks/useAppSelector';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { getCountriesList } from '@shared/redux/slices/addressEditSlice';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

type InitialValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};
export interface EditCustomerDetailsDialogProps extends Omit<DialogProps, 'onSubmit'> {
    customer?: UserEntity;
    endpointUrl: string;
    endpointVersion: string;
    onSubmit(): Promise<void> | void;
}

const useStyles = makeStyles(
    (theme) => ({
        dialog: {
            padding: 1,
        },
        halfWidth: {
            width: '48.2%',
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
            padding: '12px 16px',
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
        inputsRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        phoneDropdown: {
            position: 'fixed',
            maxHeight: '240px !important',
        },
    }),
    { name: 'EditCustomerDetailsDialog' },
);

const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().optional().nullable(),
});

export const EditCustomerDetailsDialog = (props: EditCustomerDetailsDialogProps) => {
    const { onClose, onSubmit, endpointUrl = '', endpointVersion = 'v3', ...rest } = props;
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const apiService = useInjectable(APIService);
    const availableCountries = useAppSelector((state) => state.addressEditSlice.availableCountriesList);
    const customer = useAppSelector((state) => state.editCustomerSlice.customer);
    const dispatch = useSharedDispatch();

    const [hasChanged, setHasChanged] = useState(false);

    const [currentValues, setCurrentValues] = useState<InitialValues>({
        firstName: customer?.firstName ?? '',
        lastName: customer?.lastName ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
    });

    const initialValues = useMemo<InitialValues>(
        () => ({
            firstName: customer?.firstName ?? '',
            lastName: customer?.lastName ?? '',
            email: customer?.email ?? '',
            phone: customer?.phone ?? '',
        }),
        [customer],
    );

    useEffect(() => {
        setCurrentValues(initialValues);
    }, [initialValues]);

    useEffect(
        () => {
            (async () => {
                if (availableCountries.length === 1 && availableCountries[0].id === 0) {
                    await dispatch(getCountriesList());
                }
            })();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const handleClose = useCallback(() => {
        if (onClose) {
            (onClose as any)();
        }
    }, [onClose]);

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

    const handleEditCustomer = async (values: InitialValues) => {
        const endpoint = apiService.createEndpoint(endpointUrl, { version: endpointVersion });

        setIsLoading(true);
        try {
            await endpoint.put('', {
                firstName: values?.firstName,
                lastName: values?.lastName,
                phone: values.phone,
            });
            NotificationsService.success('Customer Updated successfully!');
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
                    onSubmit={handleEditCustomer}
                    validationSchema={schema}
                    validateOnChange={true}
                >
                    {({ values, handleChange, submitForm, errors, isValidating, setValues, setFieldValue }) => (
                        <>
                            <DialogTitle className={classes.dialogTitle}>
                                {'Edit Customer'}
                                {closeIcon}
                            </DialogTitle>
                            <DialogContent className={classes.dialog}>
                                <Box display={'flex'} flexDirection={'column'} className={classes.formContainer}>
                                    <div className={classes.inputsRow}>
                                        <div className={`${classes.fieldContainer} ${classes.halfWidth}`}>
                                            <Typography className={classes.inputTitle}>First Name</Typography>
                                            <TextField
                                                className={classes.formField}
                                                placeholder="Enter First Name"
                                                name={'firstName'}
                                                value={values.firstName}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    updateCurrentValues('firstName', e.target.value);
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
                                        <div className={`${classes.fieldContainer} ${classes.halfWidth}`}>
                                            <Typography className={classes.inputTitle}>Last Name</Typography>
                                            <TextField
                                                className={classes.formField}
                                                placeholder="Enter Last Name"
                                                name={'lastName'}
                                                value={values.lastName}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    updateCurrentValues('lastName', e.target.value);
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
                                            <Typography className={classes.inputTitle}>Email</Typography>
                                            <TextField
                                                className={classes.formField}
                                                placeholder="Enter email"
                                                fullWidth
                                                name={'email'}
                                                value={values.email}
                                                disabled
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
                                            <Typography className={classes.inputTitle}>Phone Number</Typography>
                                            <InternationalPhoneNumberField
                                                value={values.phone}
                                                onChange={(value, data, event, formattedValue) => {
                                                    setFieldValue('phone', value);
                                                    updateCurrentValues('phone', formattedValue);
                                                }}
                                                dropdownClass={classes.phoneDropdown}
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

export default EditCustomerDetailsDialog;

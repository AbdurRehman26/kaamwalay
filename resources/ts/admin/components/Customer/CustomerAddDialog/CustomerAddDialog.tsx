import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import InternationalPhoneNumberField from '@shared/components/InternationalPhoneNumberField';
import { AddCustomerRequestDto } from '@shared/dto/AddCustomerRequestDto';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { storeCustomer } from '@shared/redux/slices/adminCustomersSlice';
import { useAppDispatch } from '@admin/redux/hooks';

interface CustomerAddDialogProps extends Omit<DialogProps, 'customerAdded'> {
    customerAdded?(customer: CustomerEntity): void;
    fromSubmission?: boolean;
}

const Root = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        minWidth: 580,
    },
    '.MuiDialogContent-root': {
        padding: '0px 24px 20px 24px !important',
    },
    '.MuiDialogActions-root': {
        padding: '18px 24px',
        '.MuiButton-contained': {
            padding: '10px 18px',
            borderRadius: 2,
            marginLeft: theme.spacing(3),
        },
    },
}));

const useStyles = makeStyles(
    () => {
        return {
            root: {
                backgroundColor: '#fff',
            },
            inputWithLabelContainer: {
                marginTop: '27px',
                flexDirection: 'column',
            },
            textField: {
                height: 48,
                radius: 4,
            },
            label: {
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '16px',
            },
        };
    },
    { name: 'AddCustomerDialog' },
);

export function CustomerAddDialog({ onClose, fromSubmission, customerAdded, ...rest }: CustomerAddDialogProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false);

    const customerInput = useMemo<AddCustomerRequestDto>(
        () => ({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        }),
        [],
    );

    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    const handleSubmit = useCallback(
        async (customerInput: AddCustomerRequestDto) => {
            try {
                setLoading(true);
                await dispatch(storeCustomer(customerInput))
                    .unwrap()
                    .then((customer: CustomerEntity) => {
                        handleClose({});
                        customerAdded?.(customer);
                        if (fromSubmission) {
                            window.location.href = `/admin/submissions/${customer.id}/new`;
                        }
                    });
            } catch (e: any) {
                notifications.exception(e);
                return;
            } finally {
                setLoading(false);
            }
        },
        [customerAdded, dispatch, handleClose, notifications, fromSubmission],
    );

    return (
        <Root onClose={handleClose} {...rest}>
            <Grid container alignItems={'center'} justifyContent={'space-between'} py={2} pl={3} pr={2}>
                <Grid item xs container alignItems={'center'} justifyContent={'flex-start'}>
                    <Typography variant={'h6'} fontWeight={500}>
                        Add Customer
                    </Typography>
                </Grid>

                <Grid item xs container alignItems={'center'} justifyContent={'flex-end'}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider />
            <Formik
                initialValues={customerInput}
                onSubmit={handleSubmit}
                validationSchema={CustomerAddValidationRules}
                validateOnChange
            >
                {({
                    values,
                    errors,
                    touched,
                    isValid,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                }) => (
                    <Form className={classes.root}>
                        <DialogContent>
                            <Grid container flexDirection={'column'}>
                                <Grid display={'flex'} justifyContent={'space-between'} item>
                                    <Box className={classes.inputWithLabelContainer} width={'49%'}>
                                        <Typography variant={'subtitle1'} className={classes.label}>
                                            First Name
                                        </Typography>
                                        <TextField
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name={'firstName'}
                                            className={classes.textField}
                                            fullWidth
                                            placeholder={'Enter First Name'}
                                            size={'small'}
                                            variant="outlined"
                                            value={values.firstName}
                                            error={touched.firstName && !!errors.firstName}
                                        />
                                    </Box>
                                    <Box className={classes.inputWithLabelContainer} width={'49%'}>
                                        <Typography variant={'subtitle1'} className={classes.label}>
                                            Last Name
                                        </Typography>
                                        <TextField
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name={'lastName'}
                                            className={classes.textField}
                                            fullWidth
                                            placeholder={'Enter Last Name'}
                                            size={'small'}
                                            variant="outlined"
                                            value={values.lastName}
                                            error={touched.lastName && !!errors.lastName}
                                        />
                                    </Box>
                                </Grid>

                                <Box className={classes.inputWithLabelContainer} width={'100%'}>
                                    <Typography variant={'subtitle1'} className={classes.label}>
                                        Email
                                    </Typography>
                                    <TextField
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name={'email'}
                                        className={classes.textField}
                                        fullWidth
                                        placeholder={'Enter Email'}
                                        size={'small'}
                                        variant="outlined"
                                        value={values.email}
                                        error={touched.email && !!errors.email}
                                    />
                                </Box>

                                <Box className={classes.inputWithLabelContainer} width={'100%'}>
                                    <Typography variant={'subtitle1'} className={classes.label}>
                                        Phone Number
                                    </Typography>
                                    <InternationalPhoneNumberField
                                        value={values.phone}
                                        onChange={(value, data, event, formattedValue) => {
                                            setFieldValue('phone', formattedValue);
                                        }}
                                        dropdownStyle={{
                                            position: 'fixed',
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button disabled={isSubmitting} onClick={handleClose} color={'inherit'}>
                                Cancel
                            </Button>
                            <LoadingButton
                                type={'submit'}
                                disabled={!dirty || !isValid || isSubmitting}
                                loading={loading}
                                variant={'contained'}
                            >
                                {fromSubmission ? 'Add Customer & Start Submission' : 'Add Customer'}
                            </LoadingButton>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Root>
    );
}

const RequiredMessage = 'Required field!';

export const CustomerAddValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
    firstName: yup.string().trim().required(RequiredMessage),
    lastName: yup.string().trim().required(RequiredMessage),
});

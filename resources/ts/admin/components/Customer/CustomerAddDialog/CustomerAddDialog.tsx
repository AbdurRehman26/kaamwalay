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
import MaterialUiPhoneNumber from 'material-ui-phone-number';
import React, { useCallback, useMemo, useState } from 'react';
import { SignUpValidationRules } from '@shared/components/AuthDialog/validation';
import { AddCustomerRequestDto } from '@shared/dto/AddCustomerRequestDto';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { CustomersRepository } from '@shared/repositories/Admin/CustomersRepository';

interface Props extends DialogProps {}

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

const StyledPhoneNumber = styled(MaterialUiPhoneNumber)(() => ({
    '&': {
        padding: '0px 14px !important',
        width: '100%',
        border: '1px solid lightgray',
        fontWeight: 400,
        fontSize: '1rem',
        borderRadius: 4,
    },
    '.MuiInput-input': {
        borderLeft: '1px solid lightgray',
        padding: '7px 5px !important',
    },
    '.MuiInput-root:before': {
        border: '0 !important',
    },
    '.MuiInput-root:after': {
        border: '0 !important',
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
            phoneNumberText: {
                '.MuiInput-root': {
                    padding: '8.5px 14px !important',
                },
            },
        };
    },
    { name: 'AddCustomerDialog' },
);

export function CustomerAddDialog({ onClose, ...rest }: Props) {
    const classes = useStyles();
    const customersRepository = useRepository(CustomersRepository);
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

    const handleApply = useCallback(async () => {
        try {
            setLoading(true);
            await customersRepository.storeCustomer(customerInput);
        } catch (e: any) {
            notifications.exception(e);
            return;
        } finally {
            setLoading(false);
        }

        handleClose({});
    }, [customerInput, customersRepository, handleClose, notifications]);

    const handleSubmit = useCallback(async (values: AddCustomerRequestDto) => {
        values = { ...values };
    }, []);

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
            <DialogContent>
                <Grid container flexDirection={'column'}>
                    <Formik
                        initialValues={customerInput}
                        onSubmit={handleSubmit}
                        validationSchema={SignUpValidationRules}
                        validateOnChange
                    >
                        <Form className={classes.root}>
                            <Grid display={'flex'} justifyContent={'space-between'} item>
                                <Box className={classes.inputWithLabelContainer} width={'49%'}>
                                    <Typography variant={'subtitle1'} className={classes.label}>
                                        First Name
                                    </Typography>
                                    <TextField
                                        className={classes.textField}
                                        fullWidth
                                        placeholder={'Enter First Name'}
                                        size={'small'}
                                        variant="outlined"
                                        onChange={() => console.log(1)}
                                    />
                                </Box>
                                <Box className={classes.inputWithLabelContainer} width={'49%'}>
                                    <Typography variant={'subtitle1'} className={classes.label}>
                                        Last Name
                                    </Typography>
                                    <TextField
                                        className={classes.textField}
                                        fullWidth
                                        placeholder={'Enter Last Name'}
                                        size={'small'}
                                        variant="outlined"
                                        onChange={() => console.log(1)}
                                    />
                                </Box>
                            </Grid>

                            <Box className={classes.inputWithLabelContainer} width={'100%'}>
                                <Typography variant={'subtitle1'} className={classes.label}>
                                    Email
                                </Typography>
                                <TextField
                                    className={classes.textField}
                                    fullWidth
                                    placeholder={'Enter Email'}
                                    size={'small'}
                                    variant="outlined"
                                    onChange={() => console.log(1)}
                                />
                            </Box>

                            <Box className={classes.inputWithLabelContainer} width={'100%'}>
                                <Typography variant={'subtitle1'} className={classes.label}>
                                    Phone Number
                                </Typography>
                                <StyledPhoneNumber
                                    defaultCountry="it"
                                    preferredCountries={['it', 'se']}
                                    onChange={() => {
                                        console.log(1);
                                    }}
                                />
                            </Box>
                        </Form>
                    </Formik>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color={'inherit'}>
                    Cancel
                </Button>
                <LoadingButton loading={loading} variant={'contained'} onClick={handleApply}>
                    Add Customer
                </LoadingButton>
            </DialogActions>
        </Root>
    );
}

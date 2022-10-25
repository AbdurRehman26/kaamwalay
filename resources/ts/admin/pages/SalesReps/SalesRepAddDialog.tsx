import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik } from 'formik';
import MaterialUiPhoneNumber from 'material-ui-phone-number';
import React, { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import ImageUploader from '@shared/components/ImageUploader';
import { AddSalesRepRequestDto } from '@shared/dto/AddSalesRepRequestDto';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useCountriesListsQuery } from '@shared/redux/hooks/useCountriesQuery';
import { storeCustomer } from '@shared/redux/slices/adminCustomersSlice';
import { useAppDispatch } from '@admin/redux/hooks';

interface SalesRepAddDialogProps extends Omit<DialogProps, 'customerAdded'> {
    customerAdded?(customer: CustomerEntity): void;
    fromSubmission?: boolean;
}

const Root = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        minWidth: 720,
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

const RadioContainer = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start !important',
    width: '100%',
    height: '72px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 2,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    '&.selected': {
        '.MuiSvgIcon-root': {
            color: theme.palette.primary.main,
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
                marginBottom: '2px',
                marginTop: '28px',
            },
            phoneNumberText: {
                '.MuiInput-root': {
                    padding: '8.5px 14px !important',
                },
            },
        };
    },
    { name: '' },
);

export function SalesRepAddDialog({ onClose, fromSubmission, customerAdded, ...rest }: SalesRepAddDialogProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false);
    const { data } = useCountriesListsQuery();

    const salesRepInput = useMemo<AddSalesRepRequestDto>(
        () => ({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            fixedCommission: '',
            percentCommission: '',
            listActive: true,
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
        async (salesRepInput: AddSalesRepRequestDto) => {
            try {
                setLoading(true);
                await dispatch(storeCustomer(salesRepInput))
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
                    <Typography variant={'h6'} fontWeight={400}>
                        Add Sales Rep{' '}
                        <Typography fontSize={'20px'} variant={'caption'} color={'textSecondary'}>
                            {' '}
                            (Existing User){' '}
                        </Typography>
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
                initialValues={salesRepInput}
                onSubmit={handleSubmit}
                validationSchema={SalesRepAddValidationRules}
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
                            <Grid
                                container
                                item
                                display={'flex'}
                                justifyContent={'space-between'}
                                flexWrap={'nowrap'}
                                my={2}
                            >
                                <Grid md={4} m={1}>
                                    <Typography variant={'subtitle1'} className={classes.label}>
                                        Profile Picture
                                    </Typography>
                                    <ImageUploader
                                        // imageUrl={selectedCardPhoto}

                                        // onDelete={() => setSelectedCardPhoto(null)}
                                        maxHeight="230px"
                                        maxWidth="213px"
                                        onChange={() => {}}
                                    />
                                </Grid>
                                <Grid md={8} m={1}>
                                    <Grid display={'flex'} flexWrap={'nowrap'}>
                                        <Grid md={6} mr={0.5}>
                                            <Typography variant={'subtitle1'} className={classes.label}>
                                                First Name*
                                            </Typography>
                                            <TextField
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name={'firstName'}
                                                className={classes.textField}
                                                placeholder={'Enter First Name'}
                                                size={'small'}
                                                variant="outlined"
                                                value={values.firstName}
                                                error={touched.firstName && !!errors.firstName}
                                            />
                                        </Grid>
                                        <Grid md={6} ml={0.5}>
                                            <Typography variant={'subtitle1'} className={classes.label}>
                                                Last Name*
                                            </Typography>
                                            <TextField
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name={'lastName'}
                                                className={classes.textField}
                                                placeholder={'Enter Last Name'}
                                                size={'small'}
                                                variant="outlined"
                                                value={values.lastName}
                                                error={touched.lastName && !!errors.lastName}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid>
                                        <Typography variant={'subtitle1'} className={classes.label}>
                                            Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name={'email'}
                                            className={classes.textField}
                                            placeholder={'Enter Email'}
                                            size={'small'}
                                            variant="outlined"
                                            value={values.email}
                                            error={touched.email && !!errors.email}
                                        />
                                    </Grid>
                                    <Grid>
                                        <Typography variant={'subtitle1'} className={classes.label}>
                                            Phone Number
                                        </Typography>
                                        <StyledPhoneNumber
                                            countryCodeEditable={false}
                                            defaultCountry="us"
                                            disableAreaCodes
                                            onlyCountries={data.map((country) => country.code.toLowerCase())}
                                            onChange={(e) => setFieldValue('phone', e)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider></Divider>
                            <Grid mt={2} container>
                                <Typography variant={'body1'} fontWeight={500}>
                                    Sales Commission Structure
                                </Typography>
                                <RadioContainer>
                                    <Radio checked={true} />
                                    <Typography ml={1} variant={'subtitle1'} fontWeight={500}>
                                        Fixed Amount Per Card
                                    </Typography>
                                    <TextField
                                        value={values.fixedCommission}
                                        // onChange={(e) => handleChangeCardValue(row, Number(e.target.value))}
                                        name="numberformat"
                                        size="small"
                                        id="formatted-numberformat-input"
                                        variant="outlined"
                                        InputProps={{
                                            inputProps: { min: 1 },
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        sx={{ width: '80px', marginLeft: 'auto', marginRight: '5px' }}
                                    />
                                    <Typography>/ Card</Typography>
                                </RadioContainer>
                                <RadioContainer>
                                    <Radio checked={true} />
                                    <Typography ml={1} variant={'subtitle1'} fontWeight={500}>
                                        Percent of Order Total
                                    </Typography>
                                </RadioContainer>
                                <FormControlLabel
                                    sx={{ marginLeft: 'auto', marginTop: '8px' }}
                                    labelPlacement={'start'}
                                    control={
                                        <Switch
                                            value={values.listActive}
                                            checked={false}
                                            onChange={handleChange}
                                            name="antoine"
                                        />
                                    }
                                    label="List as Active"
                                />
                            </Grid>
                        </DialogContent>
                        <Divider></Divider>
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
                                {'Add Sales Rep'}
                            </LoadingButton>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Root>
    );
}

const RequiredMessage = 'Required field!';

export const SalesRepAddValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
    firstName: yup.string().trim().required(RequiredMessage),
    lastName: yup.string().trim().required(RequiredMessage),
    phone: yup.string().trim().required(RequiredMessage),
});

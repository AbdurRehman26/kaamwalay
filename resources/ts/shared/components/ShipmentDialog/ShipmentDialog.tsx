import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import {
    ShipmentProviders,
    ShipmentProvidersList,
    getNormalizedShipmentProvider,
    isCustomShipmentProvider,
} from '@shared/constants/ShipmentProviders';

interface ShipmentDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle?: string;
    shippingProvider?: ShipmentProviders | string;
    trackingNumber?: string;
    onSubmit(props: Pick<ShipmentDialogProps, 'shippingProvider' | 'trackingNumber'>): Promise<void> | void;
}

const useStyles = makeStyles(
    (theme: Theme) =>
        createStyles({
            formControl: {
                minWidth: '100%',
            },
            dialogActions: {
                marginBottom: '12px',
                marginRight: '18px',
            },
            contentContainer: {
                width: '457px',
                [theme.breakpoints.down('sm')]: {
                    width: '100%',
                },
            },
            saveBtn: {
                marginLeft: '12px',
            },
            fieldContainer: {
                display: 'flex',
                alignItems: 'start',
                flexDirection: 'column',
                marginBottom: '24px',
            },
            selectEmpty: {
                marginTop: theme.spacing(2),
            },
            label: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.2px',
                color: 'rgba(0, 0, 0, 0.87)',
                marginBottom: '8px',
            },
            shipmentSelect: {
                height: '40px',
                width: '100%',
            },
        }),
    { name: 'ShipmentDialog' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ShipmentDialog
 * @date: 20.09.2021
 * @time: 22:47
 */
function ShipmentDialog(props: ShipmentDialogProps) {
    const { dialogTitle, shippingProvider, trackingNumber, onClose, onSubmit, ...rest } = props;
    const classes = useStyles();

    const title = useMemo(() => dialogTitle ?? 'Manage Tracking Number', [dialogTitle]);

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    const handleSubmit = useCallback(
        async ({ shippingProvider, trackingNumber, customShippingProvider }) => {
            if (isCustomShipmentProvider(shippingProvider)) {
                shippingProvider = customShippingProvider;
            }

            await onSubmit({ trackingNumber, shippingProvider });
            handleClose();
        },
        [handleClose, onSubmit],
    );

    return (
        <Dialog onClose={handleClose} {...rest}>
            <DialogTitle>{title}</DialogTitle>
            <Formik
                initialValues={{
                    customShippingProvider: isCustomShipmentProvider(shippingProvider) ? shippingProvider : '',
                    shippingProvider: getNormalizedShipmentProvider(shippingProvider),
                    trackingNumber: trackingNumber ?? '',
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({ values, errors, touched, isValid, dirty, isSubmitting, handleChange, handleBlur }) => (
                    <Form>
                        <DialogContent className={classes.contentContainer}>
                            <div className={classes.fieldContainer}>
                                <Typography className={classes.label}>Shipping Carrier</Typography>
                                <Select
                                    variant="outlined"
                                    name={'shippingProvider'}
                                    value={values.shippingProvider}
                                    className={classes.shipmentSelect}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.shippingProvider && !!errors.shippingProvider}
                                    placeholder={'Select'}
                                >
                                    {ShipmentProvidersList.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.shippingProvider && errors.shippingProvider ? (
                                    <Typography variant={'caption'} color={'error'}>
                                        {errors.shippingProvider}
                                    </Typography>
                                ) : null}
                            </div>

                            {values.shippingProvider && isCustomShipmentProvider(values.shippingProvider) ? (
                                <div className={classes.fieldContainer}>
                                    <Typography className={classes.label}>Shipping Carrier Name</Typography>
                                    <TextField
                                        name={'customShippingProvider'}
                                        value={values.customShippingProvider}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        inputProps={{ maxLength: 50 }}
                                        className={classes.formControl}
                                        variant={'outlined'}
                                        size={'small'}
                                        error={touched.customShippingProvider && !!errors.customShippingProvider}
                                    />
                                    {touched.customShippingProvider && errors.customShippingProvider ? (
                                        <Typography variant={'caption'} color={'error'}>
                                            {errors.customShippingProvider}
                                        </Typography>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className={classes.fieldContainer}>
                                <Typography className={classes.label}>Tracking Number</Typography>
                                <TextField
                                    name={'trackingNumber'}
                                    value={values.trackingNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    inputProps={{ maxLength: 50 }}
                                    className={classes.formControl}
                                    variant={'outlined'}
                                    size={'small'}
                                    error={touched.trackingNumber && !!errors.trackingNumber}
                                />
                                {touched.trackingNumber && errors.trackingNumber ? (
                                    <Typography variant={'caption'} color={'error'}>
                                        {errors.trackingNumber}
                                    </Typography>
                                ) : null}
                            </div>
                        </DialogContent>
                        <DialogActions className={classes.dialogActions}>
                            <Button disabled={isSubmitting} onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                disabled={!dirty || !isValid || isSubmitting}
                                type={'submit'}
                                color={'primary'}
                                variant={'contained'}
                                size={'medium'}
                                className={classes.saveBtn}
                                startIcon={isSubmitting ? <CircularProgress size={20} color={'inherit'} /> : null}
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default ShipmentDialog;

const validationSchema = Yup.object().shape({
    shippingProvider: Yup.string().oneOf(Object.values(ShipmentProviders)),
    trackingNumber: Yup.string().required("Tracking number can't be empty."),
    customShippingProvider: Yup.string().when('shippingProvider', {
        is: (value: any) => value === ShipmentProviders.Other,
        then: Yup.string().required("Shipping carrier name can't be empty"),
    }),
});

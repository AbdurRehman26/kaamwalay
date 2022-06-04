import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { getPaymentTitle } from '@shared/lib/payments';

interface PaymentCardDeleteDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle?: string;
    paymentCardNumber?: string;
    paymentCardId?: string;
    paymentCardBrand: string;
    onSubmit(props: Pick<PaymentCardDeleteDialogProps, 'paymentCardId'>): Promise<void> | void;
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

function PaymentCardDeleteDialog(props: PaymentCardDeleteDialogProps) {
    const { dialogTitle, paymentCardNumber, paymentCardBrand, paymentCardId, onClose, onSubmit, ...rest } = props;
    const classes = useStyles();

    const title = useMemo(
        () => dialogTitle ?? `Delete ${getPaymentTitle(paymentCardBrand)} Card ending in #${paymentCardNumber}`,
        [paymentCardBrand, paymentCardNumber, dialogTitle],
    );

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    const handleSubmit = useCallback(async () => {
        await onSubmit({ paymentCardId });
        handleClose();
    }, [handleClose, onSubmit, paymentCardId]);

    return (
        <Dialog onClose={handleClose} {...rest}>
            <DialogTitle>{title}</DialogTitle>
            <Formik
                initialValues={{
                    orderNumber: paymentCardNumber ?? '',
                    orderId: paymentCardId ?? '',
                }}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <DialogContent className={classes.contentContainer}></DialogContent>
                        <DialogActions className={classes.dialogActions}>
                            <Button disabled={isSubmitting} onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                type={'submit'}
                                color={'primary'}
                                variant={'contained'}
                                size={'medium'}
                                className={classes.saveBtn}
                                startIcon={isSubmitting ? <CircularProgress size={20} color={'inherit'} /> : null}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default PaymentCardDeleteDialog;

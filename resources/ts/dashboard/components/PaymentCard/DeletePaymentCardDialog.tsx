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
    onSubmit(): Promise<void> | void;
}

const useStyles = makeStyles(
    (theme: Theme) =>
        createStyles({
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
        }),
    { name: 'PaymentCardDeleteDialog' },
);

function DeletePaymentCardDialog(props: PaymentCardDeleteDialogProps) {
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
        await onSubmit();
        handleClose();
    }, [handleClose, onSubmit]);

    return (
        <Dialog onClose={handleClose} {...rest}>
            <DialogTitle>{title}</DialogTitle>
            <Formik initialValues={{}} onSubmit={handleSubmit}>
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

export default DeletePaymentCardDialog;

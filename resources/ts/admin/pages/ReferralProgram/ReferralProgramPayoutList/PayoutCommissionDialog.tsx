import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';

interface PayoutCommissionDialogProps extends Omit<DialogProps, 'onSubmit'> {
    onSubmit(): Promise<void> | void;
    totalPayout: number;
    totalRecipient: number;
}

const useStyles = makeStyles(
    (theme: Theme) =>
        createStyles({
            dialogActions: {
                marginBottom: '12px',
                marginRight: '18px',
                background: '#F9F9F9',
            },
            contentContainer: {
                width: '457px',
                height: '140px',
                [theme.breakpoints.down('sm')]: {
                    width: '100%',
                },
            },
            bodyContainer: {
                height: '95px',
            },
            headerBackground: {
                background: '#F9F9F9',
            },
            paymentText: {
                fontWeight: '700',
            },
            saveBtn: {
                marginLeft: '12px',
                padding: '12px',
            },
        }),
    { name: 'PayoutCommissionDialog' },
);

function PayoutCommissionDialog(props: PayoutCommissionDialogProps) {
    const { onClose, onSubmit, totalPayout, totalRecipient, ...rest } = props;
    const classes = useStyles();
    const [loading, setLoading] = useState(false);

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    const handleSubmit = useCallback(async () => {
        setLoading(true);
        await onSubmit();
        handleClose();
    }, [handleClose, onSubmit]);

    return (
        <Dialog onClose={handleClose} {...rest}>
            <Grid
                className={classes.headerBackground}
                container
                alignItems={'center'}
                justifyContent={'space-between'}
                py={2}
                pl={3}
                pr={2}
            >
                <Grid item xs container alignItems={'center'} justifyContent={'flex-start'}>
                    <Typography variant={'h6'} fontWeight={'500'}>
                        Payout Commissions
                    </Typography>
                </Grid>

                <Grid item xs container alignItems={'center'} justifyContent={'flex-end'}>
                    <IconButton sx={{ color: '#000000' }} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider />
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <DialogContent className={classes.contentContainer}>
                            <Grid item container alignItems={'center'}>
                                <Typography>
                                    Payout a total of{' '}
                                    <span className={classes.paymentText}>{formatCurrency(totalPayout)}</span> to{' '}
                                    <span className={classes.paymentText}>{totalRecipient}</span> recipients?
                                </Typography>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions className={classes.dialogActions}>
                            <Button color={'inherit'} disabled={isSubmitting} onClick={handleClose}>
                                close
                            </Button>
                            <LoadingButton
                                loading={loading}
                                type={'submit'}
                                color={'primary'}
                                variant={'contained'}
                                size={'medium'}
                                className={classes.saveBtn}
                                startIcon={isSubmitting ? <CircularProgress size={20} color={'inherit'} /> : null}
                            >
                                Confirm Payout
                            </LoadingButton>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default PayoutCommissionDialog;

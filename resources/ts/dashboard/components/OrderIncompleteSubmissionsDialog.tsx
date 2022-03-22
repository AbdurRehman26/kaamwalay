import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useMemo } from 'react';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';

interface OrderIncompleteSubmissionsDialogProps extends Omit<DialogProps, 'onClick'> {
    dialogTitle?: string;
    orders?: any;
    onSubmit: any;
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
                [theme.breakpoints.down('sm')]: {
                    width: '100%',
                },
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
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.2px',
                color: 'rgba(0, 0, 0, 0.87)',
                marginBottom: '8px',
            },
            orderNumberLabel: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.2px',
                color: '#000000DE',
            },
            dateLabel: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.2px',
                color: 'rgba(0, 0, 0, 0.54)',
            },
            cardsLabel: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.2px',
                color: 'rgba(0, 0, 0, 0.54)',
            },
            newSubmissionBtn: {
                borderRadius: 2,
                width: '90%',
                margin: 20,
                padding: '12px 24px',
                [theme.breakpoints.down('sm')]: {
                    marginLeft: 'auto',
                    padding: '9px 16px',
                },
            },
            continueBtn: {
                backgroundColor: '#EEEEEE',
                ' &:hover': {
                    backgroundColor: '#EEEEEE',
                },
                color: '#000',
                borderRadius: 2,
                padding: '12px 24px',
                [theme.breakpoints.down('sm')]: {
                    marginLeft: 'auto',
                    padding: '9px 16px',
                },
            },
        }),
    { name: 'ShipmentDialog' },
);

/**
 * @author: Abdur Rehman <kazmi@wooter.com>
 * @component: OrderIncompleteSubmissionsDialog
 * @date: 20.09.2021
 * @time: 22:47
 */
function OrderIncompleteSubmissionsDialog(props: OrderIncompleteSubmissionsDialogProps) {
    const { dialogTitle, onClose, orders, onSubmit, ...rest } = props;
    const classes = useStyles();

    const title = useMemo(() => dialogTitle ?? `New Submission`, [dialogTitle]);

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    const handleClick = useCallback(async () => {
        await onSubmit();
        handleClose();
    }, [handleClose, onSubmit]);

    const handleContinue = useCallback(async (orderId: number) => {
        window.location.href = `/dashboard/submissions/new?orderId=${orderId}`;
    }, []);

    return (
        <Dialog onClose={handleClose} {...rest}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent className={classes.contentContainer}>
                <div className={classes.fieldContainer}>
                    <Typography className={classes.label}>Your Incomplete Submission(s)</Typography>
                    {orders.map((order: OrderEntity) => (
                        <Box
                            component="span"
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            sx={{
                                width: '500px',
                                border: '1px solid lightgrey',
                                padding: '12px',
                                borderTopLeftRadius: 2,
                                borderTopRightRadius: 2,
                            }}
                        >
                            <span style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography className={classes.orderNumberLabel} variant={'body2'}>
                                    Submission #{order.orderNumber}
                                </Typography>
                                <Typography className={classes.dateLabel} variant={'caption'}>
                                    <span>
                                        Date Create: {order.createdAt ? formatDate(order.createdAt, 'MM/DD/YYYY') : '-'}
                                    </span>
                                </Typography>

                                <Typography className={classes.cardsLabel} variant={'caption'}>
                                    <span># Cards : {order.numberOfCards}</span>
                                </Typography>
                            </span>
                            <Button
                                onClick={() => handleContinue(order.id)}
                                variant={'contained'}
                                className={classes.continueBtn}
                            >
                                Continue
                            </Button>
                        </Box>
                    ))}
                </div>
            </DialogContent>
            <Button onClick={handleClick} variant={'contained'} color={'primary'} className={classes.newSubmissionBtn}>
                Start a new submission
            </Button>

            <DialogActions className={classes.dialogActions}>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default OrderIncompleteSubmissionsDialog;

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik } from 'formik';
import React, { useCallback } from 'react';
import { markOrderAsAbandoned, markOrderAsUnAbandoned } from '@shared/redux/slices/adminOrdersSlice';
import { useAppDispatch } from '@admin/redux/hooks';

interface MarkAbandonedStateDialogProps extends Omit<DialogProps, 'onSubmit'> {
    orderIds: number[];
    isAbandoned: boolean;
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
            markPaidBtn: {
                marginLeft: '12px',
            },
        }),
    { name: 'MarkAsPaidDialog' },
);

function MarkAbandonedStateDialog(props: MarkAbandonedStateDialogProps) {
    const { onClose, onSubmit, orderIds, ...rest } = props;
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const handleClose = useCallback(
        (...args) => {
            if (onClose) {
                (onClose as any)(...args);
            }
        },
        [onClose],
    );

    const handleSubmit = useCallback(async () => {
        if (props.isAbandoned) {
            await dispatch(markOrderAsUnAbandoned(orderIds));
        } else {
            await dispatch(markOrderAsAbandoned(orderIds));
        }
        await onSubmit();
        handleClose();
    }, [props.isAbandoned, onSubmit, handleClose, dispatch, orderIds]);

    const descriptionText = orderIds.length > 1 ? 'these orders' : 'this order';
    const titleText = props.isAbandoned ? `unmark ${descriptionText}` : `mark ${descriptionText}`;

    return (
        <Dialog onClose={handleClose} {...rest}>
            <DialogTitle>Are you sure you want to {titleText} as Abandoned?</DialogTitle>
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <DialogContent className={classes.contentContainer}>
                            <DialogContentText></DialogContentText>
                        </DialogContent>
                        <DialogActions className={classes.dialogActions}>
                            <Button disabled={isSubmitting} onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                type={'submit'}
                                color={'primary'}
                                variant={'contained'}
                                size={'medium'}
                                className={classes.markPaidBtn}
                                startIcon={isSubmitting ? <CircularProgress size={20} color={'inherit'} /> : null}
                            >
                                Confirm
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default MarkAbandonedStateDialog;

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useContext } from 'react';
import { ConfirmationDialogContext } from '../../contexts/ConfirmationDialogContext';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ConfirmationDialog
 * @date: 05.08.2021
 * @time: 17:32
 */
export function ConfirmationDialog() {
    const state = useContext(ConfirmationDialogContext);

    const { onClick: onCancel, ...cancelProps } = state.cancelButtonProps ?? {};
    const { onClick: onConfirm, ...confirmProps } = state.confirmButtonProps ?? {};

    return (
        <Dialog open={state.isOpen} onClose={state.reject} fullWidth maxWidth={'xs'}>
            <DialogTitle>{state.title}</DialogTitle>
            {state.message && (
                <DialogContent>
                    <DialogContentText>{state.message}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={state.reject} {...cancelProps}>
                    {state.cancelText ?? 'Cancel'}
                </Button>
                <Button onClick={state.resolve} {...confirmProps}>
                    {state.confirmText ?? 'Ok'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;

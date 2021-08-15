import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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

    return (
        <Dialog open={state.isOpen} onClose={state.reject} fullWidth maxWidth={'xs'}>
            <DialogTitle>{state.title}</DialogTitle>
            {state.message && (
                <DialogContent>
                    <DialogContentText>{state.message}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                {state.cancelText && <Button onClick={state.reject}>{state.cancelText}</Button>}
                {state.okText && <Button onClick={state.resolve}>{state.okText}</Button>}
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;

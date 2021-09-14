import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useCallback, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotesDialogProps extends Omit<DialogProps, 'onSubmit'> {
    heading: string;
    description: string;
    extraData?: Record<string, any>;
    onSubmitNotes(notes: string, extraData: Record<string, any>): any;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: NotesDialog
 * @date: 11.09.2021
 * @time: 04:46
 */
export function NotesDialog({ heading, description, onSubmitNotes, extraData, onClose, ...rest }: NotesDialogProps) {
    const notifications = useNotifications();

    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');

    const handleClose = useCallback((e) => onClose!(e, 'backdropClick'), [onClose]);

    const handleChange = useCallback((e) => setValue(e.target.value), [setValue]);

    const handleSubmit = useCallback(
        (event) => {
            setLoading(true);
            try {
                onSubmitNotes(value, extraData ?? {});
                setValue('');
            } catch (e: any) {
                notifications.exception(e);
            }
            setLoading(false);
            handleClose(event);
        },
        [handleClose, onSubmitNotes, value, extraData, notifications],
    );

    return (
        <Dialog {...rest} onClose={onClose} maxWidth={'xs'}>
            <DialogTitle>{heading}</DialogTitle>
            <DialogContent>
                {description && <DialogContentText>{description}</DialogContentText>}

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant={'outlined'}
                    placeholder={'Notes'}
                    value={value}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button disabled={loading} onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={loading && value === ''} onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NotesDialog;

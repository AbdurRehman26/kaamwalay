import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import React, { useCallback, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotesDialogProps extends Omit<DialogProps, 'onSubmit'> {
    heading: string;
    description: string;
    onSubmitNotes(notes: string, extraData: Record<string, any>): any;
    extraData?: Record<string, any>;
    textFieldProps?: TextFieldProps;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: NotesDialog
 * @date: 11.09.2021
 * @time: 04:46
 */
export function NotesDialog({
    heading,
    description,
    onSubmitNotes,
    extraData,
    onClose,
    textFieldProps,
    ...rest
}: NotesDialogProps) {
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
                    {...textFieldProps}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'inherit'} disabled={loading} onClick={handleClose}>
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

import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import React, { useCallback } from 'react';

interface NotesDialogProps extends Omit<DialogProps, ''> {
    heading?: string;
    description: string;
    extraData?: Record<string, any>;

    onClose: any;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: NotesDialog
 * @date: 11.09.2021
 * @time: 04:46
 */
export function NotesDialog({ heading, description, extraData, onClose, ...rest }: NotesDialogProps) {
    const handleClose = useCallback((e) => onClose!(e, 'backdropClick'), [onClose]);

    return (
        <Dialog {...rest} onClose={onClose} maxWidth={'lg'}>
            <DialogTitle>{heading ? heading : 'Notes'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ color: '#000', padding: '30px 0px 76px 30px', width: '600px' }}>
                {description && <p>{description}</p>}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button color={'inherit'} onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NotesDialog;

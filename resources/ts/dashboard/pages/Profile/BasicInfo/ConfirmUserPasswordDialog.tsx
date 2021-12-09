import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback, useEffect, useState } from 'react';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { confirmPasswordWithAGS } from '@shared/redux/slices/userSlice';
import { useAuth } from '@shared/hooks/useAuth';

interface ConfirmUserPasswordDialogProps {
    open: boolean;
    onClose: () => void;
    afterSaveCallback: any;
}

export function ConfirmUserPasswordDialog(props: ConfirmUserPasswordDialogProps) {
    const { open, afterSaveCallback, onClose } = props;
    const [password, setPassword] = useState('');
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
    const userEmail = useAuth().user.email;

    const dispatch = useSharedDispatch();
    const handleClose = useCallback(() => {
        setPassword('');
        onClose();
    }, [onClose]);

    const handleSave = useCallback(async () => {
        dispatch(confirmPasswordWithAGS({ password, email: userEmail }));
        afterSaveCallback();
        handleClose();
    }, [onClose, password, afterSaveCallback]);

    useEffect(() => {
        if (password.length > 0) {
            setIsSaveButtonDisabled(false);
        } else {
            setIsSaveButtonDisabled(true);
        }
    }, [password, open]);

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>One more thing ☝️</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        We need to confirm your account password in order save your changes
                    </DialogContentText>
                    <TextField margin="dense" id="name" label="Password" type="password" fullWidth variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaveButtonDisabled}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@shared/hooks/useAuth';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { confirmPasswordWithAGS } from '@shared/redux/slices/userSlice';

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
        const result: any = await dispatch(confirmPasswordWithAGS({ password, email: userEmail }));

        if (result?.error?.message) {
            return;
        }

        afterSaveCallback();
        handleClose();
    }, [dispatch, password, userEmail, afterSaveCallback, handleClose]);

    const handlePasswordChange = useCallback((event: any) => {
        setPassword(event.target.value);
    }, []);

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
                <DialogTitle>Confirm Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter your password.</DialogContentText>
                    <TextField
                        margin="dense"
                        id="name"
                        onChange={handlePasswordChange}
                        value={password}
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
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

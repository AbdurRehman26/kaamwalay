import Button, { ButtonProps } from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { dialogVisibility } from '../../redux/slices/authDialogSlice';
import { AuthDialog } from './AuthDialog';
import { useAuth } from '@shared/hooks/useAuth';

export function SubmissionButton({ ...rest }: ButtonProps) {
    const isAuthDialogOpen = useAppSelector((state) => state.authDialogSlice.dialogOpened);
    const dispatch = useAppDispatch();
    const { authenticated } = useAuth();
    const handleAuthDialogClose = () => {
        dispatch(dialogVisibility(false));
    };

    const handleOpenDialog = () => {
        if (!authenticated) {
            dispatch(dialogVisibility(true));
        } else {
            window.location.href = '/dashboard/submissions/new';
        }
    };

    return (
        <>
            <Button variant={'contained'} color={'primary'} onClick={handleOpenDialog} {...rest}>
                Grade Your Cards
            </Button>
            <AuthDialog
                open={isAuthDialogOpen}
                onClose={handleAuthDialogClose}
                subTitle="to start a Robograding submission"
            />
        </>
    );
}

export default SubmissionButton;

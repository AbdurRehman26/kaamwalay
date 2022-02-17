import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { dialogVisibility } from '../../redux/slices/authDialogSlice';
import { AuthDialog } from './AuthDialog';
import { useAuth } from '@shared/hooks/useAuth';

const ButtonContainer = styled(Button)({
    color: 'black',
    padding: 0,
});

export function SubmissionButton(): any {
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
            <ButtonContainer color={'primary'} onClick={handleOpenDialog}>
                Grade Your Cards
            </ButtonContainer>
            <AuthDialog
                open={isAuthDialogOpen}
                onClose={handleAuthDialogClose}
                subTitle="to start a Robograding submission"
            ></AuthDialog>
        </>
    );
}

export default SubmissionButton;

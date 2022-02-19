import Button, { ButtonProps } from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { dialogVisibility } from '../../redux/slices/authDialogSlice';
import { AuthDialog } from './AuthDialog';
import { useAuth } from '@shared/hooks/useAuth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';

interface Props extends ButtonProps {
    buttonContent: string;
    textColor?: string;
    margin?: boolean;
}

export function SubmissionButton({ textColor, buttonContent, margin, ...rest }: Props) {
    const isAuthDialogOpen = useAppSelector((state) => state.authDialogSlice.dialogOpened);
    const dispatch = useAppDispatch();
    const { authenticated } = useAuth();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
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
            <Button
                style={{
                    color: textColor,
                    backgroundColor: textColor === 'black' ? '#42E8E0' : '',
                    marginLeft: margin && !isMobile ? '14%' : '',
                }}
                onClick={handleOpenDialog}
                {...rest}
            >
                {buttonContent}
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

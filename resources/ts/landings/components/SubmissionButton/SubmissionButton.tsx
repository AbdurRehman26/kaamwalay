import Button, { ButtonProps } from '@mui/material/Button';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import { dialogVisibility } from '@shared/redux/slices/authenticationSlice';
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
    const isAuthDialogOpen = useSharedSelector((state) => state.authentication.dialogOpened);
    const { authenticated } = useAuth();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const dispatch = useSharedDispatch();
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

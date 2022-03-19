import Button, { ButtonProps } from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AuthDialog } from '@shared/components/Auth/AuthDialog';
import { useAuth } from '@shared/hooks/useAuth';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import { dialogVisibility } from '@shared/redux/slices/authenticationSlice';

interface Props extends ButtonProps {
    buttonContent: string;
    margin?: boolean;
    className?: string;
    plan?: string;
}

export function SubmissionButton({ buttonContent, margin, className, plan, ...rest }: Props) {
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
            window.location.href = `/dashboard/submissions/new?plan=${plan}`;
        }
    };

    return (
        <>
            <Button
                className={className}
                style={{
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

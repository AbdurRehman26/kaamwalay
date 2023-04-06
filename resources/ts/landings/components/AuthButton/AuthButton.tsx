import Button, { ButtonProps } from '@mui/material/Button';
import { useCallback } from 'react';
import { AuthDialog } from '@shared/components/AuthDialog';
import { useAuth } from '@shared/hooks/useAuth';

interface Props extends Omit<ButtonProps, 'onClick'> {
    buttonContent?: string;
}

export function AuthButton({ buttonContent, ...rest }: Props) {
    const { openAuthDialog, authDialogProps, authenticated } = useAuth();
    const redirectToPartnerProgram = useCallback(() => window.location.assign('/dashboard/referral-program/main'), []);

    return (
        <>
            <Button onClick={authenticated ? redirectToPartnerProgram : openAuthDialog} {...rest}>
                {buttonContent}
            </Button>
            <AuthDialog {...authDialogProps} isPartners />
        </>
    );
}

export default AuthButton;

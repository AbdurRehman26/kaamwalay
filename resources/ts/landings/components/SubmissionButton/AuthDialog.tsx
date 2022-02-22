import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { SignUpContent } from './SignUpContent';
import { SignInContent } from './SignInContent';
import { DialogHeader } from '@shared/components/Auth/DialogHeader';

interface Props extends DialogProps {
    title?: string;
    subTitle: string;
}

const Root = styled(Dialog)({
    '.MuiDialog-paper': {
        width: 440,
        borderRadius: 8,
    },
    '.MuiDialogContent-root': {
        padding: 0,
    },
});

export function AuthDialog({ subTitle, onClose, ...rest }: Props) {
    const [isSignIn, setSignIn] = useState(true);
    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    const handleChange = useCallback((payload: boolean) => {
        setSignIn(payload);
    }, []);

    return (
        <Root onClose={handleClose} {...rest}>
            <DialogHeader subTitle={subTitle} isSignIn={isSignIn} onClose={handleClose} />

            <DialogContent>
                {isSignIn ? (
                    <SignInContent onContentChange={handleChange} />
                ) : (
                    <SignUpContent onContentChange={handleChange} />
                )}
            </DialogContent>
        </Root>
    );
}

export default AuthDialog;

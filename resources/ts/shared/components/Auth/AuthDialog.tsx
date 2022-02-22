import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { SignUpContent } from './SignUpContent';
import { SignInContent } from './SignInContent';
import { DialogHeader } from './DialogHeader';

interface Props extends DialogProps {
    title?: string;
    subTitle: string;
}

const RootElement = styled(Dialog)({
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
        <RootElement onClose={handleClose} {...rest}>
            <DialogHeader subTitle={subTitle} isSignIn={isSignIn} onClose={handleClose} />
            <DialogContent>
                {isSignIn ? (
                    <SignInContent subTitle={subTitle} onContentChange={handleChange} />
                ) : (
                    <SignUpContent subTitle={subTitle} onContentChange={handleChange} />
                )}
            </DialogContent>
        </RootElement>
    );
}

import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { useState, useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AuthHeaderLogo from '@shared/assets/authModalIcon.svg';
import { SignUpContentHeader } from './SignUpContentHeader';
import { SignInContentHeader } from './SignInContentHeader';

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
    '.AuthDialogHeader-header': {
        background: 'linear-gradient(to right bottom, #140078, #6c31bc)',
        padding: '8px 8px 34px 8px',
    },
    '.AuthDialogHeader-headerLogo': {
        position: 'absolute',
        left: '45%',
        top: 110,
    },
});

export function AuthDialogHeader({ subTitle, onClose, ...rest }: Props) {
    const [isSignIn, setSignIn] = useState(true);

    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    const handleChange = (payload: boolean) => {
        setSignIn(payload);
    };

    return (
        <RootElement onClose={handleClose} {...rest}>
            <div className={'AuthDialogHeader-header'}>
                <Box width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                    <IconButton sx={{ color: 'white' }} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box justifyContent={'center'} display={'flex'}>
                    <Typography variant={'h6'} color={'white'} fontWeight={900} fontSize={'28px'} marginTop={'-12px'}>
                        {isSignIn ? 'Log in' : 'Sign up'} to AGS
                    </Typography>
                </Box>
                <Grid container justifyContent={'center'} display={'flex'} marginTop={'-6px'}>
                    <Typography variant={'caption'} color={'white'} fontSize={'14px'}>
                        {subTitle}
                    </Typography>
                </Grid>
            </div>
            <div className="AuthDialogHeader-headerLogo">
                <img src={AuthHeaderLogo} alt="Robograding" />
            </div>

            <DialogContent>
                {isSignIn ? (
                    <SignInContentHeader onContentChange={handleChange} />
                ) : (
                    <SignUpContentHeader onContentChange={handleChange} />
                )}
            </DialogContent>
        </RootElement>
    );
}

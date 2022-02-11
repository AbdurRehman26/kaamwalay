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
import { SignUpContent } from './SignUpContent';
import { SignInContent } from './SignInContent';

interface Props extends DialogProps {
    title?: string;
    subTitle: string;
}

const Header = styled('div')({
    background: 'linear-gradient(to right bottom, #140078, #6c31bc)',
    padding: '8px 8px 34px 8px',
});

const HeaderLogo = styled('div')({
    position: 'absolute',
    left: '45%',
    top: 110,
});

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
                console.log('A A A ', onclose);
                console.log('Event ', event);
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    const handleChange = (data: boolean) => {
        setSignIn(data);
    };

    return (
        <Root onClose={handleClose} {...rest}>
            <Header>
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
            </Header>
            <HeaderLogo>
                <img src={AuthHeaderLogo} alt="Robograding" />
            </HeaderLogo>

            <DialogContent>
                {isSignIn ? (
                    <SignInContent handleChange={handleChange} handleClose={handleClose} />
                ) : (
                    <SignUpContent handleChange={handleChange} handleClose={handleClose} />
                )}
            </DialogContent>
        </Root>
    );
}

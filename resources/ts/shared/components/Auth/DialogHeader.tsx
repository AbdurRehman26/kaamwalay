import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import AuthHeaderLogo from '@shared/assets/authModalIcon.svg';

interface Props {
    subTitle: string;
    isSignIn: boolean;
    onClose: Function;
}

const Header = styled('div')({
    '.AuthDialogHeader-header': {
        background: 'linear-gradient(to right bottom, #140078, #6c31bc)',
        padding: '8px 8px 34px 8px',
    },
    '.AuthDialogHeader-headerLogo': {
        position: 'absolute',
        left: '45%',
        top: 100,
    },
});

export function DialogHeader({ subTitle, isSignIn, onClose }: Props) {
    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <Header>
            <div className={'AuthDialogHeader-header'}>
                <Grid container justifyContent={'flex-end'}>
                    <IconButton sx={{ color: 'white' }} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
                <Box justifyContent={'center'} display={'flex'}>
                    <Typography variant={'h5'} color={'white'} fontWeight={900} marginTop={'-8px'}>
                        {isSignIn ? 'Log in' : 'Sign up'} to AGS
                    </Typography>
                </Box>
                <Grid container justifyContent={'center'}>
                    <Typography variant={'body2'} color={'white'}>
                        {subTitle}
                    </Typography>
                </Grid>
            </div>
            <div className="AuthDialogHeader-headerLogo">
                <img src={AuthHeaderLogo} alt="Robograding" />
            </div>
        </Header>
    );
}

import CloseIcon from '@mui/icons-material/Close';
import { DialogProps } from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import AuthHeaderLogo from '@shared/assets/authModalIcon.svg';

interface Props {
    title: string;
    subtitle: string;
    onClose?: DialogProps['onClose'];
    hasClose?: boolean;
}

const Header = styled('div')(({ theme }) => ({
    position: 'relative',
    '.AuthDialogHeader-header': {
        background: 'linear-gradient(to right bottom, #140078, #6c31bc)',
        padding: theme.spacing(1, 2, 6),
    },
    '.AuthDialogHeader-headerLogo': {
        position: 'absolute',
        left: '50%',
        bottom: 0,
        transform: 'translate(-50%, 50%)',
    },
}));

export function AuthDialogHeader({ subtitle, title, onClose, hasClose }: Props) {
    const handleClose = useCallback(
        (event) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    return (
        <Header>
            <div className={'AuthDialogHeader-header'}>
                <Grid container justifyContent={'flex-end'} minHeight={40}>
                    {hasClose ? (
                        <IconButton sx={{ color: 'white' }} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </Grid>
                <Grid container direction={'column'} alignItems={'center'} justifyContent={'center'} px={2}>
                    <Typography variant={'h5'} color={'white'} fontWeight={900} align={'center'}>
                        {title}
                    </Typography>
                    <Typography variant={'body2'} color={'white'} align={'center'}>
                        {subtitle}
                    </Typography>
                </Grid>
            </div>
            <div className="AuthDialogHeader-headerLogo">
                <img src={AuthHeaderLogo} alt="Robograding" />
            </div>
        </Header>
    );
}

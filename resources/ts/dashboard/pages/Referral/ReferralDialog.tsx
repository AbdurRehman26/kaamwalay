import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Banner from '@shared/assets/banner.png';
import { useConfiguration } from '@shared/hooks/useConfiguration';

const ReferralDialogBox = styled(Dialog)({
    '& .MuiPaper-root': {
        background: '#F8EFFF',
        boxShadow:
            '0px 12px 17px rgba(0, 0, 0, 0.14), 0px 5px 22px rgba(0, 0, 0, 0.12), 0px 7px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        maxWidth: '464px',
    },
    '.BannerImage': {
        maxWidth: '228px',
        maxHeight: '119px',
    },
    '.DialogTitle': {
        fontWeight: 900,
        fontSize: '28px',
        lineHeight: '36px',
        textAlign: 'center',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.DialogDescription': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '24px',
        textAlign: 'center',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '10px 0px',
    },
    '.ImageDiv': {
        display: 'flex',
        justifyContent: 'center',
        margin: '15px 0px',
    },
    '.DialogActions': {
        display: 'flex',
        justifyContent: 'center',
        margin: '15px 0px',
    },
    '.ReferButton': {
        background: '#20BFB8',
        borderRadius: '4px',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: '#FFFFFF',
        padding: '15px 50px',
        '&:hover': {
            background: '#20BFB8',
        },
    },
    '.CloseLink': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '10px 0px',
        cursor: 'pointer',
    },
});

export function ReferralDialog() {
    const [open, setOpen] = useState(false);
    const { featureReferralDiscountPercentage } = useConfiguration();

    useEffect(() => {
        const isModalShow = localStorage.getItem('show');
        if (isModalShow !== 'hide') {
            setOpen(true);
            localStorage.setItem('show', 'hide');
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <ReferralDialogBox open={open} onClose={handleClose}>
            <DialogTitle>
                <IconButton
                    onClick={handleClose}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className={'ImageDiv'}>
                    <img className={'BannerImage'} src={Banner} alt={'Banner'} />
                </div>
                <div>
                    <Typography className={'DialogTitle'}>
                        Earn $$$ by referring your friends to RoboGrading.{' '}
                    </Typography>
                </div>
                <div>
                    <Typography className={'DialogDescription'}>
                        Refer your friends/followers and give them {featureReferralDiscountPercentage}% OFF their first
                        RoboGrading submission. You will get commission as soon as they pay as well as when someone they
                        refer pays. Not store credit, you’ll earn cold hard cash!
                    </Typography>
                </div>
                <div className={'DialogActions'}>
                    <Button className={'ReferButton'} component={Link} to={`/referral-program/main`}>
                        REFER NOW
                    </Button>
                </div>
                <div className={'DialogActions'}>
                    <Typography className={'CloseLink'} onClick={handleClose}>
                        CLOSE
                    </Typography>
                </div>
            </DialogContent>
        </ReferralDialogBox>
    );
}

export default ReferralDialog;

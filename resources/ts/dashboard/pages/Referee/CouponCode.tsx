import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@shared/assets/robogradingLogo.svg';
import { getRemainingTime } from '@shared/components/Counter';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)',
            height: 72,
            justifyContent: 'center',
            [theme.breakpoints.down('sm')]: {
                height: 60,
            },
        },
        brand: {
            display: 'block',
        },
        brandImage: {
            display: 'block',
            height: 48,
            [theme.breakpoints.down('sm')]: {
                height: 36,
            },
        },
        toggleButton: {
            marginRight: 6,
            marginLeft: -6,
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        hiddenOnMobile: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        submitButton: {
            display: 'flex',
            color: theme.palette.primary.light,
            borderRadius: 24,
            padding: theme.spacing(1.25, 4.25),
            fontWeight: 500,
            fontSize: 14,
            border: `2px solid ${theme.palette.primary.light} !important`,
            [theme.breakpoints.down('sm')]: {
                minWidth: 40,
                width: 40,
                height: 40,
                textIndent: -9999,
                overflow: 'hidden',
                padding: theme.spacing(1),
                '& .MuiButton-startIcon': {
                    marginRight: -2,
                },
            },
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
            },
        },

        navLink: {
            fontWeight: 500,
            color: '#fff',
            margin: theme.spacing(0, 2.4),
        },
        newSubmissionBtn: {
            margin: 30,
            borderRadius: 24,
            padding: '12px 78px',
        },
        checkMark: {
            height: 56,
            width: 56,
            color: 'rgba(56, 142, 60, 1)',
        },
    }),
    {
        name: 'LayoutHeader',
    },
);

const Root = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

interface CouponType {
    availableFrom: string;

    availableTill: string;

    discountValue: string;

    code: string;
}

export function CouponCode() {
    const classes = useStyles();
    const apiService = useInjectable(APIService);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState<CouponType>({
        availableFrom: '',
        availableTill: '',
        discountValue: '',
        code: '',
    });

    const endTime = coupon.availableTill ? new Date(new Date(coupon.availableTill.toString()).getTime() + 86400000) : 0;
    const timeInMs =
        coupon.availableTill && new Date() <= endTime
            ? new Date(coupon.availableTill.toString()).getTime() + 86400000
            : 0;

    const defaultRemainingTime = {
        seconds: '00',
        minutes: '00',
        hours: '00',
    };

    const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateRemainingTime(timeInMs);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeInMs]);

    function updateRemainingTime(countdown: any) {
        setRemainingTime(getRemainingTime(countdown));
    }

    const onClickSubmitButton = () => {
        navigate(`/submissions/new?coupon=${coupon.code}`);
    };

    console.log(endTime, timeInMs, remainingTime);
    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        const loadCoupon = async () => {
            const endpoint = apiService.createEndpoint('customer/referee/coupon', { version: 'v3' });

            try {
                const { data } = await endpoint.get('');
                setIsLoading(false);
                setCoupon(data);
            } catch (error: any) {
                window.location.replace('/dashboard');
            }
        };

        loadCoupon();
    }, [apiService]);

    return (
        <Root>
            <AppBar position="sticky" className={classes.root} elevation={4}>
                <Toolbar>
                    <IconButton color={'inherit'} size={'medium'} className={classes.toggleButton}>
                        <MenuIcon color={'inherit'} />
                    </IconButton>

                    <MuiLink href={'/'} className={classes.brand}>
                        <img src={Logo} alt={'Robograding'} className={classes.brandImage} />
                    </MuiLink>
                </Toolbar>
            </AppBar>
            {!isLoading ? (
                <Grid marginTop={'4%'} container direction={'column'}>
                    <Box marginTop={0} marginBottom={4} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <CheckCircleIcon className={classes.checkMark} />
                        <Typography
                            margin={1}
                            fontFamily={'Roboto'}
                            fontWeight={400}
                            fontSize={16}
                            letterSpacing={'1.5px'}
                            color={'rgba(0, 0, 0, 0.54)'}
                            variant={'body1'}
                            align={'center'}
                        >
                            SIGN UP SUCCESSFUL
                        </Typography>
                        <Typography
                            fontFamily={'Roboto'}
                            fontWeight={400}
                            fontSize={16}
                            letterSpacing={'0.15px'}
                            margin={'1px'}
                            variant={'body1'}
                            align={'center'}
                        >
                            Here is the discount code for your {coupon.discountValue}% OFF:
                        </Typography>

                        <Typography
                            fontFamily={'Roboto'}
                            fontStyle={'normal'}
                            fontSize={'64px'}
                            margin={1}
                            fontWeight={700}
                            variant={'h3'}
                            align={'center'}
                        >
                            {coupon.code}
                        </Typography>
                        <Divider />

                        <Typography
                            margin={1}
                            variant={'body1'}
                            align={'center'}
                            fontFamily={'Roboto'}
                            fontStyle={'normal'}
                            fontSize={'16px'}
                            fontWeight={400}
                            lineHeight={'24px'}
                            letterSpacing={'0.15px'}
                        >
                            Click the button below to start your submission & get your discount.
                            <br />
                            Your code will expire in Time {remainingTime.hours}h : {remainingTime.minutes}m :{' '}
                            {remainingTime.seconds}s
                        </Typography>

                        <Button
                            onClick={onClickSubmitButton}
                            variant={'contained'}
                            color={'primary'}
                            className={classes.newSubmissionBtn}
                        >
                            Start Your Submission Now
                        </Button>
                    </Box>
                </Grid>
            ) : (
                <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            )}
        </Root>
    );
}

export default CouponCode;

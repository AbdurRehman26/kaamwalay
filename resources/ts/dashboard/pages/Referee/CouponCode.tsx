import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import Logo from '@shared/assets/robogradingLogo.svg';

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
            padding: '12px 24px',
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

export function CouponCode() {
    const classes = useStyles();

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

            <Grid container direction={'column'}>
                <Box marginTop={0} marginBottom={4} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Typography margin={1} color={'dimgray'} variant={'body1'} align={'center'}>
                        SIGN UP SUCCESSFUL
                    </Typography>
                    <Typography margin={1} variant={'body1'} align={'center'}>
                        Here is the discount code for your 50% OFF:
                    </Typography>

                    <Typography margin={1} fontWeight={'bold'} variant={'h3'} align={'center'}>
                        VX808:
                    </Typography>
                    <Divider />

                    <Typography margin={1} variant={'body1'} align={'center'}>
                        Click the button below to start your submission & get your discount.
                        <br />
                        Your code will expire in Time
                    </Typography>

                    <Button variant={'contained'} color={'primary'} className={classes.newSubmissionBtn}>
                        Start Your Submission Now
                    </Button>
                </Box>
            </Grid>
        </Root>
    );
}

export default CouponCode;

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MuiLink from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@shared/assets/robogradingLogo.svg';
import { DashboardNavigationDrawer } from '@dashboard/components/DashboardNavigationDrawer';
import { UserDropdown } from '@dashboard/components/Layout/UserDropdown';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setNavigationDrawerOpen } from '@dashboard/redux/slices/dashboardSlice';
import UploadIcon from '@mui/icons-material/FileUploadOutlined';
import Button from '@mui/material/Button';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)',
            marginBottom: 28,
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
            height: 54,
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
    }),
    {
        name: 'LayoutHeader',
    },
);

export function LayoutHeader() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isNavigationDrawerOpen = useAppSelector((state) => state.dashboardSlice.isNavigationDrawerOpen);
    const trigger = useScrollTrigger({
        disableHysteresis: true,
    });
    const handleMenuIconClick = useCallback(() => {
        dispatch(setNavigationDrawerOpen(!isNavigationDrawerOpen));
    }, [dispatch, isNavigationDrawerOpen]);

    return (
        <AppBar position="sticky" className={classes.root} elevation={trigger ? 4 : 0}>
            <DashboardNavigationDrawer />
            <Toolbar>
                <IconButton
                    color={'inherit'}
                    size={'medium'}
                    className={classes.toggleButton}
                    onClick={handleMenuIconClick}
                >
                    <MenuIcon color={'inherit'} />
                </IconButton>

                <MuiLink href={'/'} className={classes.brand}>
                    <img src={Logo} alt={'Robograding'} className={classes.brandImage} />
                </MuiLink>
                <Grid container alignItems={'center'} justifyContent={'center'} flexGrow={1}>
                    <Grid container alignItems={'center'} justifyContent={'center'} className={classes.hiddenOnMobile}>
                        <MuiLink className={classes.navLink} href={'/feed'}>
                            Live Feed
                        </MuiLink>
                        <MuiLink className={classes.navLink} href={'/pop'}>
                            POP Report
                        </MuiLink>
                    </Grid>
                </Grid>
                <Button
                    component={Link}
                    to={'/submissions/new'}
                    color={'primary'}
                    variant={'outlined'}
                    className={classes.submitButton}
                    startIcon={<UploadIcon />}
                >
                    Submit
                </Button>
                <Box className={classes.hiddenOnMobile}>
                    <UserDropdown />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

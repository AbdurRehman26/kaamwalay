import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@shared/assets/robogradingLogo.svg';
import { DashboardNavigationDrawer } from '@dashboard/components/DashboardNavigationDrawer';
import { UserDropdown } from '@dashboard/components/Layout/UserDropdown';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setNavigationDrawerOpen } from '@dashboard/redux/slices/dashboardSlice';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)',
            marginBottom: 28,
        },
        brand: {
            display: 'block',
        },
        brandImage: {
            display: 'block',
            height: 54,
        },
        toggleButton: {
            marginRight: theme.spacing(1.5),
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        userDropdownHolder: {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
    }),
    {
        name: 'LayoutHeader',
    },
);

function LayoutHeader() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isNavigationDrawerOpen = useAppSelector((state) => state.dashboardSlice.isNavigationDrawerOpen);

    const handleMenuIconClick = useCallback(() => {
        dispatch(setNavigationDrawerOpen(!isNavigationDrawerOpen));
    }, [dispatch, isNavigationDrawerOpen]);

    return (
        <AppBar position="static" className={classes.root} elevation={0}>
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

                <Link to={'/'} className={classes.brand}>
                    <img src={Logo} alt={'Robograding'} className={classes.brandImage} />
                </Link>
                <Box flexGrow={1} />
                <Box className={classes.userDropdownHolder}>
                    <UserDropdown />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default LayoutHeader;

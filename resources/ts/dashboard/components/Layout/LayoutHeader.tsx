import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Link } from 'react-router-dom';
import RobogradingAvatar from '@shared/assets/dummyAvatar.svg';
import Logo from '@shared/assets/robogradingLogo.svg';
import DashboardNavigationDrawer from '@dashboard/components/DashboardNavigationDrawer';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { setNavigationDrawerOpen } from '@dashboard/redux/slices/dashboardSlice';

const useStyles = makeStyles(
    {
        root: {
            background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)',
            marginBottom: 28,
        },
        toggleButton: {},
        brand: {
            display: 'block',
        },
        brandImage: {
            display: 'block',
            height: 54,
        },
    },
    {
        name: 'DashboardHeader',
    },
);

function LayoutHeader() {
    const classes = useStyles();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const isNavigationDrawerOpen = useAppSelector((state) => state.dashboardSlice.isNavigationDrawerOpen);
    const dispatch = useAppDispatch();

    function handleMenuIconClick() {
        dispatch(setNavigationDrawerOpen(!isNavigationDrawerOpen));
    }

    return (
        <AppBar position="static" className={classes.root} elevation={0}>
            <DashboardNavigationDrawer />
            <Toolbar>
                {isMobile ? (
                    <IconButton
                        color={'inherit'}
                        size={'medium'}
                        className={classes.toggleButton}
                        onClick={handleMenuIconClick}
                    >
                        <MenuIcon color={'inherit'} />
                    </IconButton>
                ) : null}

                <Link to={'/'} className={classes.brand}>
                    <img src={Logo} alt={'Robograding'} className={classes.brandImage} />
                </Link>
                <Box flexGrow={1} />
                {!isMobile ? <Avatar src={RobogradingAvatar} alt={'Robograding Avatar'} /> : null}
            </Toolbar>
        </AppBar>
    );
}

export default LayoutHeader;

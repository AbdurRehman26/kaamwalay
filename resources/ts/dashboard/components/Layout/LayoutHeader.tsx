import { useMediaQuery } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Link } from 'react-router-dom';
import RobogradingAvatar from '@shared/assets/dummyAvatar.png';
import Logo from '@shared/assets/robogradingLogo.png';
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
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
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

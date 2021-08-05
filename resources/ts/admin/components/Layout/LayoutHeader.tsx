import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import Logo from '@shared/assets/logo.svg';

import { useLayoutHeaderStyles } from '@admin/components/Layout/styles';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { drawerVisibility } from '@admin/redux/slices/pageSlice';

function LayoutHeader() {
    const classes = useLayoutHeaderStyles();
    const dispatch = useAppDispatch();
    const drawerState = useAppSelector((state) => state.page.drawerOpened);

    const handleDrawerState = useCallback(() => dispatch(drawerVisibility(!drawerState)), [drawerState, dispatch]);

    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <IconButton onClick={handleDrawerState}>
                    <MenuIcon />
                </IconButton>
                <Link to={'/'} className={classes.brand}>
                    <img src={Logo} alt={'Robograding'} className={classes.brandImage} />
                </Link>
                <Box flexGrow={1} />
                <Avatar>AT</Avatar>
            </Toolbar>
        </AppBar>
    );
}

export default LayoutHeader;

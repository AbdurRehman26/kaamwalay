import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@shared/assets/logo.svg';
import { useAuth } from '@shared/hooks/useAuth';
import { useLayoutHeaderStyles } from '@admin/components/Layout/styles';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { drawerVisibility } from '@admin/redux/slices/pageSlice';

function LayoutHeader() {
    const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);

    const classes = useLayoutHeaderStyles();
    const { user, logout } = useAuth();
    const dispatch = useAppDispatch();

    const drawerState = useAppSelector((state) => state.page.drawerOpened);
    const handleDrawerState = useCallback(() => dispatch(drawerVisibility(!drawerState)), [drawerState, dispatch]);

    const handleUserMenuOpen = useCallback((e) => setUserMenuAnchor(e.target), [setUserMenuAnchor]);
    const handleUserMenuClose = useCallback(() => setUserMenuAnchor(null), [setUserMenuAnchor]);
    const handleLogout = useCallback(() => {
        logout();
        handleUserMenuClose();
    }, [logout, handleUserMenuClose]);

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
                <ButtonBase component={Avatar} onClick={handleUserMenuOpen}>
                    {user.getInitials()}
                </ButtonBase>
                <Menu open={!!userMenuAnchor} anchorEl={userMenuAnchor} onClose={handleUserMenuClose}>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default LayoutHeader;

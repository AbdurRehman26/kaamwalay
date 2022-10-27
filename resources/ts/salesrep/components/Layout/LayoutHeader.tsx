import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import { useLayoutHeaderStyles } from '@salesrep/components/Layout/styles';
import { useAppDispatch, useAppSelector } from '@salesrep/redux/hooks';
import { drawerVisibility } from '@salesrep/redux/slices/pageSlice';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@shared/assets/logo.svg';
import { useAuth } from '@shared/hooks/useAuth';

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
                <IconButton onClick={handleDrawerState} size="large">
                    <MenuIcon />
                </IconButton>
                <Link to={'/'} className={classes.brand}>
                    <img src={Logo} alt={'Robograding'} className={classes.brandImage} />
                </Link>
                <Box flexGrow={1} />
                <IconButton size="large">
                    <LocalPoliceOutlinedIcon />
                </IconButton>
                <Avatar component={ButtonBase} onClick={handleUserMenuOpen}>
                    {user.getInitials()}
                </Avatar>
                <Menu open={!!userMenuAnchor} anchorEl={userMenuAnchor} onClose={handleUserMenuClose}>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default LayoutHeader;

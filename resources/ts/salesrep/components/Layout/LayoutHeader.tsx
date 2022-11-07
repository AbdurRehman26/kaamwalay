import Face from '@mui/icons-material/Face';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { UserDropdown } from '@salesrep/components/Layout/UserDropdown';
import { useLayoutHeaderStyles } from '@salesrep/components/Layout/styles';
import { useAppDispatch, useAppSelector } from '@salesrep/redux/hooks';
import { drawerVisibility } from '@salesrep/redux/slices/pageSlice';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@shared/assets/logo.svg';

function LayoutHeader() {
    const classes = useLayoutHeaderStyles();
    const dispatch = useAppDispatch();

    const drawerState = useAppSelector((state) => state.page.drawerOpened);
    const handleDrawerState = useCallback(() => dispatch(drawerVisibility(!drawerState)), [drawerState, dispatch]);

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
                <Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }} color={'black'}>
                        {'Sales'}
                    </Typography>
                </Box>
                <IconButton size="large">
                    <Face />
                </IconButton>
                <Box className={classes.hiddenOnMobile}>
                    <UserDropdown />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default LayoutHeader;

import LocalPoliceOutlined from '@mui/icons-material/LocalPoliceOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@shared/assets/logo.svg';
import { useAuth } from '@shared/hooks/useAuth';
import { UserDropdown } from '@admin/components/Layout/UserDropdown';
import { useLayoutHeaderStyles } from '@admin/components/Layout/styles';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import { drawerVisibility } from '@admin/redux/slices/pageSlice';

function LayoutHeader() {
    const classes = useLayoutHeaderStyles();
    const { user } = useAuth();
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
                        {' '}
                        {user.roles[0].name.charAt(0).toUpperCase() + user.roles[0].name.slice(1)}{' '}
                    </Typography>
                </Box>
                <IconButton sx={{ color: '#000000DE' }} size="large">
                    <LocalPoliceOutlined />
                </IconButton>
                <Box className={classes.hiddenOnMobile}>
                    <UserDropdown />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default LayoutHeader;

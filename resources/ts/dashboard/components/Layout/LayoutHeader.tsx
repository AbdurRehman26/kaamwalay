import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';

import RobogradingAvatar from '@shared/assets/dummyAvatar.png';
import Logo from '@shared/assets/robogradingLogo.png';

const useStyles = makeStyles(
    {
        root: {
            background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)',
            marginBottom: 32,
        },
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

    return (
        <AppBar position="static" className={classes.root} elevation={0}>
            <Toolbar>
                <Link to={'/'} className={classes.brand}>
                    <img src={Logo} alt={'Robograding'} className={classes.brandImage} />
                </Link>
                <Box flexGrow={1} />
                <Avatar src={RobogradingAvatar} alt={'Robograding Avatar'} />
            </Toolbar>
        </AppBar>
    );
}

export default LayoutHeader;

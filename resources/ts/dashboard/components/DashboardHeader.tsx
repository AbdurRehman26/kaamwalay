import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import RobogradingAvatar from '../assets/DummyAvatar.png';
import Logo from '../assets/robograding-logo.png';

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '95px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)',
    },
    logoAndAvatarContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '80%',
        height: '95px',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
});

function DashboardHeader() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.logoAndAvatarContainer}>
                <img src={Logo} alt={'Robograding Logo'} />
                <img src={RobogradingAvatar} alt={'Robograding Avatar'} />
            </div>
        </div>
    );
}

export default DashboardHeader;

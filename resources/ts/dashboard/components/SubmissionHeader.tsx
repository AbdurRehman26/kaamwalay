import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Link } from 'react-router-dom';
import RobogradingAvatar from '@shared/assets/dummyAvatar.svg';
import Logo from '@shared/assets/robogradingLogo.svg';
import CustomizedSteppers from './HeaderStepper';
import { Theme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            width: '100%',
            minWidth: '100%',
            paddingTop: '14px',
            display: 'flex',
            flexDirection: 'column',
            borderBottomColor: '#20BFB8',
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
            background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)',
        },
        logoAndAvatarContainer: {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        headerTitleContainer: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            marginTop: '84px',
        },
        headerTitle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '32px',
            [theme.breakpoints.down('sm')]: {
                fontSize: '24px',
            },
        },
    }),
    {
        name: 'SubmissionHeaderStyle',
    },
);

function SubmissionHeader() {
    const classes = useStyles();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    return (
        <div className={classes.root}>
            <Container>
                <div className={classes.logoAndAvatarContainer}>
                    <Link to={'/'}>
                        <img style={{ width: isMobile ? '220px' : '' }} src={Logo} alt={'Robograding Logo'} />
                    </Link>
                    <img style={{ width: isMobile ? '40px' : '' }} src={RobogradingAvatar} alt={'Robograding Avatar'} />
                </div>
                <div className={classes.headerTitleContainer}>
                    <Typography variant="h1" className={classes.headerTitle}>
                        Submit Cards For Grading
                    </Typography>
                </div>
                <CustomizedSteppers />
            </Container>
        </div>
    );
}

export default SubmissionHeader;

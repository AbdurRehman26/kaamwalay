import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import RobogradingAvatar from '@shared/assets/dummyAvatar.svg';
import Logo from '@shared/assets/robogradingLogo.svg';
import CustomizedSteppers from './HeaderStepper';

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
            [theme.breakpoints.down('sm')]: {
                marginTop: '35px',
            },
        },
        headerTitle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '32px',
            [theme.breakpoints.down('sm')]: {
                fontSize: '24px',
            },
        },
        headerLogo: {
            [theme.breakpoints.down('sm')]: {
                width: '220px',
            },
        },
        headerAvatar: {
            [theme.breakpoints.down('sm')]: {
                width: '40px',
            },
        },
    }),
    {
        name: 'SubmissionHeaderStyle',
    },
);

function SubmissionHeader() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Container>
                <div className={classes.logoAndAvatarContainer}>
                    <Link href={'/'}>
                        <img className={classes.headerLogo} src={Logo} alt={'Robograding Logo'} />
                    </Link>
                    <img className={classes.headerAvatar} src={RobogradingAvatar} alt={'Robograding Avatar'} />
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

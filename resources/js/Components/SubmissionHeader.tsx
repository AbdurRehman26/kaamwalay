import React from 'react';
import {Container, makeStyles, Typography} from "@material-ui/core";
import Logo from '../Assets/robograding-logo.png';
import RobogradingAvatar from '../Assets/DummyAvatar.png'
import CustomizedSteppers from "./HeaderStepper";

const useStyles = makeStyles({
    root: {
        width: '100vw',
        minWidth: '100vw',
        height: '244px',
        paddingTop: '14px',
        display: 'flex',
        flexDirection: 'column',
        borderBottomColor: '#20BFB8',
        borderBottomStyle: 'solid',
        borderBottomWidth: '2px',
        background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)'
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
    }
}, {
    name: 'SubmissionHeaderStyle'
});

function SubmissionHeader() {

    const classes = useStyles();

    return (<div className={classes.root}>
        <Container>
            <div className={classes.logoAndAvatarContainer}>
                <img src={Logo}
                       alt={'Robograding Logo'}/>
                <img src={RobogradingAvatar} alt={'Robograding Avatar'}/>
            </div>
            <div className={classes.headerTitleContainer}>
                <Typography variant="h1" className={classes.headerTitle}>
                    Submit Cards For Grading
                </Typography>
            </div>
            <CustomizedSteppers />
        </Container>

    </div>)
}

export default SubmissionHeader;

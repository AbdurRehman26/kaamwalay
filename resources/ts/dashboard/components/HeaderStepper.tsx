import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import clsx from 'clsx';
import React from 'react';

import { ReactComponent as Step01Icon } from '../assets/step01Icon.svg';
import { ReactComponent as Step02Icon } from '../assets/step02Icon.svg';
import { useAppSelector } from '../redux/hooks';

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundColor: '#20BFB8',
        },
    },
    completed: {
        '& $line': {
            backgroundColor: '#20BFB8',
        },
    },
    line: {
        height: 2,
        border: 0,
        backgroundColor: '#20BFB8',
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        backgroundColor: '#fff',
        borderRadius: '50%',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#20BFB8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundColor: '#20BFB8',
    },
    completed: {},
});

function ColorlibStepIcon(props: StepIconProps) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <Step01Icon fill={active ? '#fff' : '#20BFB8'} stroke={!active ? '#20BFB8' : ''} />,
        2: <Step02Icon fill={active ? '#fff' : '#20BFB8'} stroke={!active ? '#20BFB8' : ''} />,
        3: <LocalShippingOutlinedIcon htmlColor={active ? '#fff' : '#20BFB8'} />,
        4: <PaymentOutlinedIcon htmlColor={active ? '#fff' : '#20BFB8'} />,
        5: <ReceiptOutlinedIcon htmlColor={active ? '#fff' : '#20BFB8'} />,
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        button: {
            marginRight: theme.spacing(1),
        },
        stepper: {
            background: 'none',
            border: 'none',
            marginTop: '10px',
            maxWidth: '552px',

            width: '100%',
        },
        stepperContainer: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    }),
);

function getSteps() {
    return ['Service', 'Cards', 'Shipping', 'Payment', 'Review'];
}

export default function CustomizedSteppers() {
    const classes = useStyles();
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const steps = getSteps();

    return (
        <>
            <div className={classes.stepperContainer}>
                <Stepper
                    alternativeLabel
                    className={classes.stepper}
                    activeStep={currentStep}
                    connector={<ColorlibConnector />}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
        </>
    );
}
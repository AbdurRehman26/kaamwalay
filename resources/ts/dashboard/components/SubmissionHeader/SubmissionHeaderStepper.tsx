import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { cx } from '@shared/lib/utils/cx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCustomStep } from '../../redux/slices/newSubmissionSlice';
import { SubmissionHeaderStepIcon } from './SubmissionHeaderStepIcon';

const AvailableSteps = ['Service', 'Cards', 'Shipping', 'Payment', 'Review'];

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    transform: 'translate(0, 64px)',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
        marginTop: '-30px',
    },

    '.SubmissionHeaderStepper-stepper': {
        width: '100%',
        maxWidth: 552,
    },
    '.SubmissionHeaderStepper-stepActive, .SubmissionHeaderStepper-stepActive *': {
        cursor: 'pointer',
    },
    '.MuiStepConnector-alternativeLabel': {
        top: 22,
    },
    '.MuiStepConnector-active .MuiStepConnector-line, .MuiStepConnector-completed .MuiStepConnector-line': {
        backgroundColor: theme.palette.primary.main,
    },
    '.MuiStepConnector-line': {
        height: 2,
        border: 0,
        backgroundColor: theme.palette.primary.main,
    },
}));

export function SubmissionHeaderStepper() {
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const stepValidations = useAppSelector((state) => state.newSubmission.stepValidations);
    const dispatch = useAppDispatch();
    const handleStepClick = useCallback(
        (index: number) => () => {
            if (stepValidations[index - 1] || stepValidations[index] || index <= currentStep) {
                dispatch(setCustomStep(index));
            }
        },
        [currentStep, dispatch, stepValidations],
    );

    return (
        <Root>
            <Stepper alternativeLabel className={'SubmissionHeaderStepper-stepper'} activeStep={currentStep}>
                {AvailableSteps.map((label, index) => (
                    <Step
                        key={label}
                        active={stepValidations[index - 1] || stepValidations[index] || index <= currentStep}
                        completed={index === currentStep}
                        onClick={handleStepClick(index)}
                        className={cx('SubmissionHeaderStepper-step', {
                            'SubmissionHeaderStepper-stepActive':
                                stepValidations[index - 1] || stepValidations[index] || index <= currentStep,
                        })}
                    >
                        <StepLabel StepIconComponent={SubmissionHeaderStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Root>
    );
}

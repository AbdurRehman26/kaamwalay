import React, {useCallback, useEffect} from 'react';
import SubmissionHeader from "../Components/SubmissionHeader";
import {useAppDispatch, useAppSelector} from "../hooks";
import {Container} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {nextStep, backStep, setIsNextDisabled} from "../Redux/Slices/newSubmissionSlice";
import SubmissionStep01Content from "../Components/SubmissionStep01Content";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SubmissionStep02Content from "../Components/SubmissionStep02Content";

const useStyles = makeStyles({
    pageContentContainer: {
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '40px',
        marginBottom: '64px',
    },
    nextBtn: {
        color: '#fff',
        width: ({currentStep}: any) => currentStep !== 0 ? '140px' : '224px',
        height: '48px',
    },
    backBtn: {
        marginRight: '12px',
        color: '#20BFB8',
    }
})

function NewSubmissionPage() {
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const classes = useStyles({currentStep});
    const isNextDisabled = useAppSelector((state) => state.newSubmission.isNextDisabled);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);

    const getStepContent = useCallback(() => {
        switch (currentStep) {
            case 0:
                return (<SubmissionStep01Content/>);
            case 1:
                return (<SubmissionStep02Content />);
            default:
                return (<h2>yo</h2>)
        }
    }, [currentStep])


    const handleNext = () => {
        dispatch(nextStep())
    }

    const handleBack = () => {
        dispatch(backStep());
    }

    useEffect(() => {
        if(selectedCards.length === 0 && currentStep === 1) {
            dispatch(setIsNextDisabled(true))
        } else {
            dispatch(setIsNextDisabled(false));
        }
    }, [selectedCards, currentStep])

    return (
        <>
            <SubmissionHeader/>
            <Container>
                <div className={classes.pageContentContainer}>

                    {getStepContent()}

                    <div className={classes.buttonsContainer}>
                        {currentStep !== 0 ? <Button variant={'text'} color={'secondary'}
                                                     className={classes.backBtn}
                                                     startIcon={<ArrowBackIcon />}
                                                     onClick={handleBack}> Back </Button>
                         : null}
                        <Button variant={'contained'} disabled={isNextDisabled} color={'primary'} onClick={handleNext}
                                className={classes.nextBtn}> Next </Button>
                    </div>
                </div>

            </Container>
        </>
    )
}

export default NewSubmissionPage;

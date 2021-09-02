import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { useCallback, useEffect } from 'react';
import ReactGA from 'react-ga';
import { EventCategories, PaymentMethodEvents, ShippingAddressEvents } from '@shared/constants/GAEventsTypes';
import StripeContainer from '@dashboard/components/PaymentForm/StripeContainer';
import SubmissionHeader from '../../components/SubmissionHeader';
import SubmissionStep01Content from '../../components/SubmissionStep01Content';
import SubmissionStep02Content from '../../components/SubmissionStep02Content';
import SubmissionStep03Content from '../../components/SubmissionStep03Content';
import SubmissionStep04Content from '../../components/SubmissionStep04Content';
import SubmissionStep05Content from '../../components/SubmissionStep05Content';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    backStep,
    createOrder,
    getSavedAddresses,
    getShippingFee,
    getStatesList,
    nextStep,
    setIsNextDisabled,
} from '../../redux/slices/newSubmissionSlice';

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
        width: ({ currentStep }: any) => (currentStep !== 0 ? '140px' : '224px'),
        height: '48px',
    },
    backBtn: {
        marginRight: '12px',
        color: '#20BFB8',
    },
});

export function NewSubmission() {
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const classes = useStyles({ currentStep });
    const isNextDisabled = useAppSelector((state) => state.newSubmission.isNextDisabled);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const selectedExistingAddressId = useAppSelector(
        (state) => state.newSubmission.step03Data.selectedExistingAddress.id,
    );
    const paymentMethodId = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);

    const getStepContent = useCallback(() => {
        switch (currentStep) {
            case 0:
                return <SubmissionStep01Content />;
            case 1:
                return <SubmissionStep02Content />;
            case 2:
                return <SubmissionStep03Content />;
            case 3:
                return <SubmissionStep04Content />;
            case 4:
                return <SubmissionStep05Content />;
            default:
                return <h2>yo</h2>;
        }
    }, [currentStep]);

    const handleNext = async () => {
        // Executing different stuff before next step loads
        if (currentStep === 1) {
            await dispatch(getShippingFee(selectedCards));
            await dispatch(getStatesList());
            await dispatch(getSavedAddresses());
            dispatch(nextStep());
            return;
        }
        if (currentStep === 2) {
            ReactGA.event({
                category: EventCategories.ShippingAddresses,
                action:
                    selectedExistingAddressId === -1
                        ? ShippingAddressEvents.continuedWithNewAddress
                        : ShippingAddressEvents.continuedWithExisting,
            });
            dispatch(nextStep());
            return;
        }
        if (currentStep === 3) {
            ReactGA.event({
                category: EventCategories.Submissions,
                action:
                    paymentMethodId === 1
                        ? PaymentMethodEvents.continuedWithStripePayment
                        : PaymentMethodEvents.continuedWithPaypalPayment,
            });
            await dispatch(createOrder());
            dispatch(nextStep());
            return;
        }
        dispatch(nextStep());
    };

    const handleBack = async () => {
        if (currentStep === 3) {
            await dispatch(getShippingFee(selectedCards));
            await dispatch(getStatesList());
            await dispatch(getSavedAddresses());
            dispatch(backStep());
            return;
        }
        dispatch(backStep());
    };

    useEffect(() => {
        if (selectedCards.length === 0 && currentStep === 1) {
            dispatch(setIsNextDisabled(true));
        } else {
            if (currentStep !== 3) {
                dispatch(setIsNextDisabled(false));
            }
        }
    }, [selectedCards, currentStep, dispatch]);

    return (
        <>
            <SubmissionHeader />
            <StripeContainer>
                <Container>
                    <div className={classes.pageContentContainer}>
                        {getStepContent()}

                        <div className={classes.buttonsContainer}>
                            {currentStep !== 0 ? (
                                <Button
                                    variant={'text'}
                                    color={'secondary'}
                                    className={classes.backBtn}
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                            ) : null}
                            {currentStep !== 4 ? (
                                <Button
                                    variant={'contained'}
                                    disabled={isNextDisabled}
                                    color={'primary'}
                                    onClick={handleNext}
                                    className={classes.nextBtn}
                                >
                                    Next
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </Container>
            </StripeContainer>
        </>
    );
}

export default NewSubmission;

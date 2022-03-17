import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect } from 'react';
import ReactGA from 'react-ga';
import { EventCategories, PaymentMethodEvents, ShippingAddressEvents } from '@shared/constants/GAEventsTypes';
import { useNotifications } from '@shared/hooks/useNotifications';
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
    getAvailableCredit,
    getSavedAddresses,
    getShippingFee,
    getStatesList,
    nextStep,
    setIsNextDisabled,
    setIsNextLoading,
} from '../../redux/slices/newSubmissionSlice';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';
import theme from '@shared/styles/theme';

const useStyles = makeStyles({
    pageContentContainer: {
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonsContainer: {
        position: 'fixed',
        width: '100%',
        display: 'flex',
        bottom: '0',
        flexDirection: 'row',
        padding: '10px 10px',
        justifyContent: 'center',
        background: '#FFFFFF',
        boxShadow: '0px 3px 4px rgb(0 0 0 / 14%), 0px 3px 3px rgb(0 0 0 / 12%), 0px 1px 8px rgb(0 0 0 / 20%)',
    },
    nextBtn: {
        color: '#fff',
        width: '183px',
        height: '48px',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '28px',
        [theme.breakpoints.down('sm')]: {
            width: ({ currentStep }: any) => (currentStep === 0 ? '100%' : '183px'),
        },
    },
    backBtn: {
        color: '#000',
        marginRight: '12px',
        width: '183px',
        height: '48px',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)',
        background: '#F2F2F2',
        borderRadius: '28px',
        '&:hover': {
            background: '#F2F2F2',
        },
    },
});

export function NewSubmission() {
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const classes = useStyles({ currentStep });
    const isNextDisabled = useAppSelector((state) => state.newSubmission.isNextDisabled);
    const isNextLoading = useAppSelector((state) => state.newSubmission.isNextLoading);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const selectedExistingAddressId = useAppSelector(
        (state) => state.newSubmission.step03Data.selectedExistingAddress.id,
    );
    const paymentMethodId = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const notifications = useNotifications();

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

        if (currentStep === 0) {
            dispatch(setIsNextLoading(true));
            dispatch(nextStep());
            dispatch(setIsNextLoading(false));
            window.scroll(0, 0);
            pushToDataLayer({ event: 'google-ads-service-selected' });
        }

        if (currentStep === 1) {
            dispatch(setIsNextLoading(true));
            await dispatch(getShippingFee(selectedCards));
            await dispatch(getStatesList());
            await dispatch(getSavedAddresses());
            dispatch(nextStep());
            dispatch(setIsNextLoading(false));
            window.scroll(0, 0);
            pushToDataLayer({ event: 'google-ads-cards-selected' });
            return;
        }

        if (currentStep === 2) {
            dispatch(setIsNextLoading(true));
            ReactGA.event({
                category: EventCategories.ShippingAddresses,
                action:
                    selectedExistingAddressId === -1
                        ? ShippingAddressEvents.continuedWithNewAddress
                        : ShippingAddressEvents.continuedWithExisting,
            });
            dispatch(nextStep());
            dispatch(setIsNextLoading(false));
            await dispatch(getAvailableCredit()).unwrap();
            window.scroll(0, 0);
            pushToDataLayer({ event: 'google-ads-shipping-info-submitted' });
            return;
        }
        if (currentStep === 3) {
            try {
                dispatch(setIsNextLoading(true));
                await dispatch(createOrder()).unwrap();
                ReactGA.event({
                    category: EventCategories.Submissions,
                    action:
                        paymentMethodId === 1
                            ? PaymentMethodEvents.continuedWithStripePayment
                            : PaymentMethodEvents.continuedWithPaypalPayment,
                });
                dispatch(setIsNextLoading(false));
                dispatch(nextStep());
                window.scroll(0, 0);
                pushToDataLayer({ event: 'google-ads-payment-info-submitted' });
                return;
            } catch (error: any) {
                dispatch(setIsNextLoading(false));
                notifications.exception(error);
                return;
            }
        }
    };

    const handleBack = async () => {
        window.scroll(0, 0);
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
                <div className={classes.pageContentContainer}>
                    {getStepContent()}

                    <div className={classes.buttonsContainer}>
                        {currentStep !== 0 ? (
                            <Button
                                variant={'contained'}
                                color={'secondary'}
                                className={classes.backBtn}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        ) : null}
                        {currentStep !== 4 ? (
                            <Button
                                variant={'contained'}
                                disabled={isNextDisabled || isNextLoading}
                                color={'primary'}
                                onClick={handleNext}
                                className={classes.nextBtn}
                                startIcon={isNextLoading ? <CircularProgress size={24} color={'secondary'} /> : null}
                            >
                                Next
                            </Button>
                        ) : null}
                    </div>
                </div>
            </StripeContainer>
        </>
    );
}

export default NewSubmission;

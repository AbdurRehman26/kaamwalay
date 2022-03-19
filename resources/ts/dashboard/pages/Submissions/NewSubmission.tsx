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
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles((theme) => ({
    pageContentContainer: {
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: '1 1 auto',
        '& .MuiContainer-root': {
            flex: '1 1 auto',
        },
    },
    buttonsContainer: {
        position: 'sticky',
        bottom: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        backgroundColor: '#fff',
        boxShadow: theme.shadows[4],
    },
    buttonsHolder: {
        maxWidth: 360,
        [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
        },
    },
    buttons: {
        height: 48,
        borderRadius: 24,
        margin: theme.spacing(0, 0.75),
        boxShadow: theme.shadows[3],
        maxWidth: 182,
        [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
        },
    },
}));

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
            case 1:
                return <SubmissionStep02Content />;
            case 2:
                return <SubmissionStep03Content />;
            case 3:
                return <SubmissionStep04Content />;
            case 4:
                return <SubmissionStep05Content />;
            default:
                return <SubmissionStep01Content />;
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
                        <Grid
                            container
                            alignItems={'center'}
                            justifyContent={'center'}
                            flexWrap={'nowrap'}
                            className={classes.buttonsHolder}
                        >
                            {currentStep !== 0 ? (
                                <Button
                                    variant={'contained'}
                                    color={'inherit'}
                                    className={classes.buttons}
                                    onClick={handleBack}
                                    fullWidth
                                >
                                    Back
                                </Button>
                            ) : null}
                            {currentStep !== 4 ? (
                                <LoadingButton
                                    variant={'contained'}
                                    disabled={isNextDisabled || isNextLoading}
                                    color={'primary'}
                                    onClick={handleNext}
                                    className={classes.buttons}
                                    loading={isNextLoading}
                                    fullWidth
                                >
                                    Next
                                </LoadingButton>
                            ) : null}
                        </Grid>
                    </div>
                </div>
            </StripeContainer>
        </>
    );
}

export default NewSubmission;

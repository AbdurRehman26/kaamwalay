import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useNavigate } from 'react-router-dom';
import { ApplicationEventsEnum } from '@shared/constants/ApplicationEventsEnum';
import { EventCategories, PaymentMethodEvents, ShippingAddressEvents } from '@shared/constants/GAEventsTypes';
import { useApplicationEvent } from '@shared/hooks/useApplicationEvent';
import { useNotifications } from '@shared/hooks/useNotifications';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import SubmissionHeader from '../../../components/SubmissionHeader/SubmissionHeader';
import {
    SubmissionStep01Content,
    SubmissionStep02Content,
    SubmissionStep03Content,
    SubmissionStep04Content,
    SubmissionStep05Content,
} from '../../../components/SubmissionSteps';
import SubmissionSummary from '../../../components/SubmissionSummary';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
    backStep,
    clearSubmissionState,
    createOrder,
    getAvailableCredit,
    getSavedAddresses,
    getShippingFee,
    getStatesList,
    nextStep,
    setIsNextDisabled,
    setIsNextLoading,
} from '../../../redux/slices/newSubmissionSlice';
import { SubmissionValidator } from './SubmissionValidator';

const useStyles = makeStyles((theme) => ({
    pageContentContainer: {
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: '1 1 auto',
        marginBottom: theme.spacing(8),
        '& .MuiContainer-root': {
            flex: '1 1 auto',
        },
    },
    greyDescriptionText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'center',
        letterSpacing: '1.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        marginTop: '12px',
        marginBottom: '12px',
    },
    darkDescriptionText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'center',
        letterSpacing: '0.1px',
        color: '#000',
        textDecoration: 'none',
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
    const notifications = useNotifications();

    const [mountChildren, setMountChildren] = useState(true);
    const [submitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const currentStep = useAppSelector((state) => state.newSubmission.currentStep);
    const classes = useStyles({ currentStep });
    const isNextDisabled = useAppSelector((state) => state.newSubmission.isNextDisabled);
    const isNextLoading = useAppSelector((state) => state.newSubmission.isNextLoading);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const selectedExistingAddressId = useAppSelector(
        (state) => state.newSubmission.step03Data.selectedExistingAddress.id,
    );
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
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
        try {
            dispatch(setIsNextLoading(true));

            if (currentStep === 0) {
                googleTagManager({ event: 'google-ads-service-selected' });
            } else if (currentStep === 1) {
                await dispatch(getShippingFee(selectedCards));
                await dispatch(getStatesList());
                await dispatch(getSavedAddresses());
                googleTagManager({ event: 'google-ads-cards-selected' });
            } else if (currentStep === 2) {
                ReactGA.event({
                    category: EventCategories.ShippingAddresses,
                    action:
                        selectedExistingAddressId === -1
                            ? ShippingAddressEvents.continuedWithNewAddress
                            : ShippingAddressEvents.continuedWithExisting,
                });

                try {
                    await dispatch(getAvailableCredit()).unwrap();
                } finally {
                    googleTagManager({ event: 'google-ads-shipping-info-submitted' });
                }
            }

            dispatch(nextStep());
            window.scroll(0, 0);
        } catch (e) {
            notifications.exception(e as Error);
        } finally {
            dispatch(setIsNextLoading(false));
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

    const handleCompleteSubmission = async () => {
        try {
            setIsSubmitting(true);
            const order = await dispatch(createOrder()).unwrap();
            ReactGA.event({
                category: EventCategories.Submissions,
                action: PaymentMethodEvents.payLater,
            });
            dispatch(clearSubmissionState());
            dispatch(invalidateOrders());
            navigate(`/submissions/${order.id}/confirmation`);
        } catch (error: any) {
            dispatch(setIsNextLoading(false));
            notifications.exception(error);
            return;
        }
    };

    const children = mountChildren ? (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12} md={currentStep !== 0 ? 8 : 12}>
                    {getStepContent()}
                </Grid>

                {currentStep !== 0 ? (
                    <Grid item xs={12} md={4}>
                        <SubmissionSummary />
                    </Grid>
                ) : null}
                {currentStep === 4 && isMobile ? (
                    <Grid item xs={12}>
                        <Typography className={classes.greyDescriptionText}>
                            By clicking “SUBMIT”, you are agreeing to the Robograding{' '}
                            <a href={'/terms-and-conditions'} className={classes.darkDescriptionText}>
                                Terms and Conditions.
                            </a>
                        </Typography>
                    </Grid>
                ) : null}
            </Grid>
        </Container>
    ) : null;

    useEffect(() => {
        if (selectedCards.length === 0 && currentStep === 1) {
            dispatch(setIsNextDisabled(true));
        } else {
            if (currentStep !== 3) {
                dispatch(setIsNextDisabled(false));
            }
        }
    }, [selectedCards, currentStep, dispatch]);

    useApplicationEvent(ApplicationEventsEnum.AuthSessionLogin, () => {
        setMountChildren(false);
        setTimeout(() => {
            setMountChildren(true);
        }, 50);
    });

    return (
        <>
            <SubmissionValidator />
            <SubmissionHeader />
            <div className={classes.pageContentContainer}>{children}</div>
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
                    {currentStep === 4 && isMobile ? (
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            className={classes.buttons}
                            onClick={handleCompleteSubmission}
                            disabled={submitting}
                            fullWidth
                        >
                            SUBMIT
                        </Button>
                    ) : null}
                </Grid>
            </div>
        </>
    );
}

export default NewSubmission;

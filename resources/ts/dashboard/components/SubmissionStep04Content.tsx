import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    setIsNextDisabled,
    setUseShippingAddressAsBilling,
    setBillingAddress,
} from '../redux/slices/newSubmissionSlice';
import StepDescription from './StepDescription';
import SubmissionSummary from './SubmissionSummary';
import { ApplyPromoCode } from '@dashboard/components/ApplyPromoCode';
import { ApplyCredit } from '@dashboard/components/ApplyCredit';
import { styled } from '@mui/material/styles';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

const useStyles = makeStyles((theme) => ({
    stepDescriptionContainer: {
        maxWidth: '425px',
    },
    leftSideContainer: {
        marginTop: 9,
    },
    divider: {
        marginTop: '64px',
    },
    valueAlert: {
        marginTop: '16px',
    },
    shippingMethodContainer: {
        marginBottom: '24px',
    },
    sectionLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        marginBottom: '20px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
    },
    methodDescription: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.1px',
        marginBottom: '4px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    sectionContainer: {
        marginTop: '32px',
    },
    shippingMethodItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
    },
    shippingAddressSectionHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fieldContainer: {
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
    },
    inputsRow01: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputsRow02: {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputsRow03: {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputsRow04: {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    billingAddressAsShippingContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '12px',
    },
    billingAddressTitle: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    billingAddressItem: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    loaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    addressFieldContainer: {
        width: '80%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    aptFieldContainer: {
        width: '18%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    cityFieldContainer: {
        width: '30%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    stateFieldContainer: {
        width: '32%',
        marginTop: '6px',
        [theme.breakpoints.down('sm')]: {
            width: '47%',
        },
    },
    zipFieldContainer: {
        width: '32%',
        [theme.breakpoints.down('sm')]: {
            width: '47%',
        },
    },
    availableCreditLabel: {
        color: 'rgba(0, 0, 0, 0.54);',
        fontSize: '12px',
    },
    paymentNoteContainer: {
        border: '1px solid',
        padding: 10,
        borderRadius: 6,
        borderColor: '#20BFB8',
        backgroundColor: '#EDFAF9',
    },
    paymentNoteHeading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
    },
}));

export function SubmissionStep04Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);
    const finalShippingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedExistingAddress);

    useEffect(() => {
        // no need to add any validation logic in this step
        dispatch(setIsNextDisabled(false));
        dispatch(setUseShippingAddressAsBilling(true));
        dispatch(setBillingAddress(finalShippingAddress));
    }, [dispatch, finalShippingAddress]);
    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription title={`Payment`} description={'Apply credit or add promo code on this page.'} />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <div className={classes.leftSideContainer}>
                        <div className={classes.paymentNoteContainer}>
                            <Typography variant={'h6'} className={classes.paymentNoteHeading}>
                                <StyledMoneyIcon />
                                Great news! You don't have to pay, today.
                            </Typography>
                            <Typography variant={'body1'} mt={1} mb={1}>
                                If you have any promo codes or credit you can apply them to see what your order total
                                will be, but you can complete this submission and ship us your cards without paying a
                                thing. We'll ask you later on to enter payment details, before we ship your graded and
                                slabbed cards back to you.
                            </Typography>
                        </div>
                    </div>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        {availableCredit > 0 ? (
                            <div className={classes.shippingMethodContainer}>
                                <Typography className={classes.sectionLabel} style={{ marginBottom: '3px' }}>
                                    Apply Credit
                                </Typography>
                                <Typography variant={'caption'} className={classes.availableCreditLabel}>
                                    You have <span style={{ fontWeight: 'bold' }}>${availableCredit}</span> in available
                                    credit.
                                </Typography>
                                <div className={classes.shippingMethodItemContainer} style={{ marginTop: '20px' }}>
                                    <ApplyCredit />
                                </div>
                            </div>
                        ) : null}

                        <div className={classes.shippingMethodContainer}>
                            <Typography className={classes.sectionLabel}> Add a Promo Code </Typography>
                            <div className={classes.shippingMethodItemContainer}>
                                <ApplyPromoCode />
                            </div>
                        </div>
                        <Divider light sx={{ marginBottom: '6px' }} />
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SubmissionSummary />
                </Grid>
            </Grid>

            <Divider light className={classes.divider} />
        </Container>
    );
}

export default SubmissionStep04Content;

const StyledMoneyIcon = styled(MonetizationOnOutlinedIcon)({
    minWidth: 32,
    height: 32,
    color: '#20BFB8',
    marginRight: 8,
});

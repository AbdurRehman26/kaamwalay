import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import { AuthDialog } from '@shared/components/AuthDialog/AuthDialog';
import { ApplicationEventsEnum } from '@shared/constants/ApplicationEventsEnum';
import { useApplicationEvent } from '@shared/hooks/useApplicationEvent';
import { useAuth } from '@shared/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    getAvailableCredit,
    setBillingAddress,
    setIsNextDisabled,
    setUseShippingAddressAsBilling,
} from '../../redux/slices/newSubmissionSlice';
import { ApplyCredit } from '../ApplyCredit';
import { ApplyPromoCode } from '../ApplyPromoCode';
import StepDescription from '../StepDescription';

const useStyles = makeStyles((theme) => ({
    stepDescriptionContainer: {
        maxWidth: '425px',
    },
    leftSideContainer: {
        marginTop: 12,
    },
    divider: {
        marginTop: '64px',
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
    const { authenticated, authDialogProps, closeAuthDialog, openAuthDialog } = useAuth();

    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);
    const shippingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress);
    const existingAddresses = useAppSelector((state) => state.newSubmission.step03Data.existingAddresses);
    const useCustomShippingAddress = useAppSelector((state) => state.newSubmission.step03Data.useCustomShippingAddress);
    const selectedExistingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedExistingAddress);
    const finalShippingAddress =
        existingAddresses.length !== 0 && !useCustomShippingAddress && selectedExistingAddress.id !== 0
            ? selectedExistingAddress
            : shippingAddress;

    useApplicationEvent(ApplicationEventsEnum.AuthSessionUnauthorized, () => {
        openAuthDialog();
    });

    useEffect(() => {
        // no need to add any validation logic in this step
        dispatch(setIsNextDisabled(false));
        dispatch(setUseShippingAddressAsBilling(true));
        dispatch(setBillingAddress(finalShippingAddress));
    }, [dispatch, finalShippingAddress]);

    useEffect(() => {
        if (authenticated) {
            dispatch(getAvailableCredit()).unwrap();
            closeAuthDialog();
        } else {
            openAuthDialog();
        }
    }, [dispatch, authenticated, openAuthDialog, closeAuthDialog]);

    return (
        <>
            <AuthDialog
                {...authDialogProps}
                subtitle={'In order to continue you need to login with a Robograding account.'}
                internalCloseOnly
            />
            <StepDescription title={`Payment`} description={'Apply credit or add promo code on this page.'} />

            <Divider light />

            <div className={classes.leftSideContainer}>
                <div className={classes.paymentNoteContainer}>
                    <Typography variant={'h6'} className={classes.paymentNoteHeading}>
                        <StyledMoneyIcon />
                        Great news! You don't have to pay, today.
                    </Typography>
                    <Typography variant={'body1'} mt={1} mb={1}>
                        If you have any promo codes or credit you can apply them to see what your order total will be,
                        but you can complete this submission and ship us your cards without paying a thing. We'll ask
                        you later on to enter payment details, before we ship your graded and slabbed cards back to you.
                    </Typography>
                </div>
            </div>
            <Box marginTop={5} />
            <Divider light />
            <div className={classes.leftSideContainer}>
                {availableCredit > 0 ? (
                    <div className={classes.shippingMethodContainer}>
                        <Typography className={classes.sectionLabel} style={{ marginBottom: '3px' }}>
                            Apply Credit
                        </Typography>
                        <Typography variant={'caption'} className={classes.availableCreditLabel}>
                            You have <span style={{ fontWeight: 'bold' }}>${availableCredit}</span> in available credit.
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
            </div>

            <Divider light className={classes.divider} />
        </>
    );
}

export default SubmissionStep04Content;

const StyledMoneyIcon = styled(MonetizationOnOutlinedIcon)({
    minWidth: 24,
    height: 24,
    color: '#20BFB8',
    marginRight: 10,
});

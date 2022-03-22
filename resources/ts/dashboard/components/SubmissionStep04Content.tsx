import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useAppSelector } from '../redux/hooks';
import StepDescription from './StepDescription';
import SubmissionSummary from './SubmissionSummary';
import { ApplyPromoCode } from '@dashboard/components/ApplyPromoCode';
import { ApplyCredit } from '@dashboard/components/ApplyCredit';

const useStyles = makeStyles((theme) => ({
    stepDescriptionContainer: {
        maxWidth: '425px',
    },
    leftSideContainer: {
        marginTop: '12px',
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
    fieldContainer: {
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
    },
    loaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    availableCreditLabel: {
        color: 'rgba(0, 0, 0, 0.54);',
        fontSize: '12px',
    },
}));

export function SubmissionStep04Content() {
    const classes = useStyles();
    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);

    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title={`Enter Payment Details`}
                    description={'Select your payment method and enter details.'}
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
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
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <SubmissionSummary />
                </Grid>
            </Grid>
        </Container>
    );
}

export default SubmissionStep04Content;

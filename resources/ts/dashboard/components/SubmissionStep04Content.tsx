import {
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getServiceLevels } from '../redux/slices/newSubmissionSlice';
import AddedSubmissionCards from './AddedSubmissionCards';
import CardSubmissionSearchField from './CardSubmissionSearchField';
import CardsSearchResults from './CardsSearchResults';
import PaymentMethodItem from './PaymentMethodItem';
import ServiceLevelItem from './ServiceLevelItem';
import ShippingMethodItem from './ShippingMethodItems';
import StepDescription from './StepDescription';
import SubmissionSummary from './SubmissionSummary';

const useStyles = makeStyles({
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
    shippingAddressContainer: {
        marginTop: '32px',
    },
    shippingMethodItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
});

const GreenCheckbox = withStyles({
    root: {
        color: '#20BFB8',
        '&$checked': {
            color: '#20BFB8',
        },
    },
    checked: {},
})((props: any) => <Checkbox color="default" {...props} />);

export function SubmissionStep04Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title="Enter payment details"
                    description={'Select your payment method and enter details.'}
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        <div className={classes.shippingMethodContainer}>
                            <Typography className={classes.sectionLabel}> Select Payment Method </Typography>
                            <div className={classes.shippingMethodItemContainer}>
                                <PaymentMethodItem isSelected={true} methodName={'Credit or Debit Card'} />
                                <PaymentMethodItem isSelected={false} methodName={'Paypal'} />
                            </div>
                        </div>
                        <Divider light />
                        <div className={classes.shippingAddressContainer}>
                            <div className={classes.shippingAddressSectionHeader}>
                                <Typography className={classes.sectionLabel}>Add Card</Typography>
                                <FormControlLabel
                                    control={<GreenCheckbox checked={true} onChange={() => ''} name="checkedG" />}
                                    label="Save for later"
                                />
                            </div>

                            <div className={classes.inputsRow01}>
                                <div className={classes.fieldContainer} style={{ width: '100%' }}>
                                    <Typography className={classes.methodDescription}>Card Number</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter Card Number"
                                        fullWidth
                                        size={'small'}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.inputsRow02}>
                                <div className={classes.fieldContainer} style={{ width: '65%' }}>
                                    <Typography className={classes.methodDescription}>Expiration Date</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="MM/YY"
                                        fullWidth
                                        size={'small'}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <div className={classes.fieldContainer} style={{ width: '28%' }}>
                                    <Typography className={classes.methodDescription}>CVV</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="XXX"
                                        fullWidth
                                        size={'small'}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={classes.billingAddressAsShippingContainer}>
                            <FormControlLabel
                                control={<GreenCheckbox checked={true} onChange={() => ''} name="checkedG" />}
                                label="Billing address same as shipping"
                            />
                            <Typography className={classes.billingAddressTitle}>Billing Address</Typography>
                            <Typography className={classes.billingAddressItem}>James Smith</Typography>
                            <Typography className={classes.billingAddressItem}>727 Amsterdam Blvd.</Typography>
                            <Typography className={classes.billingAddressItem}>New York, NY 10301, US</Typography>
                        </div>
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

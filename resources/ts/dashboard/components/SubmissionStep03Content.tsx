import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import NumberFormat from 'react-number-format';
import * as yup from 'yup';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    getStatesList,
    setIsNextDisabled,
    setSaveShippingAddress,
    updateShippingAddressField,
} from '../redux/slices/newSubmissionSlice';
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
        flexDirection: 'column',
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

let schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    address: yup.string().required(),
    apt: yup.string().optional(),
    city: yup.string().required(),
    state: yup.object().shape({
        name: yup.string().required(),
        id: yup.number().required(),
    }),
    zipCode: yup.string().required(),
    phoneNumber: yup.string().required(),
});

export function SubmissionStep03Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const saveForLater = useAppSelector((state) => state.newSubmission.step03Data.saveForLater);

    useEffect(() => {
        dispatch(getStatesList());
    }, [dispatch]);

    const firstName = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.firstName);
    const lastName = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.lastName);
    const address = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.address);
    const apt = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.apt);
    const city = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.city);
    const state = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.state);
    const zipCode = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.zipCode);
    const phoneNumber = useAppSelector((state) => state.newSubmission.step03Data.selectedAddress?.phoneNumber);
    const availableStates = useAppSelector((state) => state.newSubmission.step03Data?.availableStatesList);

    useEffect(() => {
        schema
            .isValid({
                firstName,
                lastName,
                address,
                apt,
                city,
                state,
                zipCode,
                phoneNumber,
            })
            .then((valid) => {
                dispatch(setIsNextDisabled(!valid));
            });
    }, [firstName, lastName, address, apt, city, state, zipCode, phoneNumber]);

    function onSaveForLater() {
        dispatch(setSaveShippingAddress(!saveForLater));
    }

    function updateField(fieldName: any, newValue: any) {
        dispatch(updateShippingAddressField({ fieldName, newValue }));
    }

    function updateShippingState(stateId: number) {
        const stateLookup = availableStates.find((state) => state.id === stateId);
        if (stateLookup) {
            dispatch(
                updateShippingAddressField({
                    fieldName: 'state',
                    newValue: { name: stateLookup.name, id: stateLookup.id, code: stateLookup.code },
                }),
            );
        }
    }

    return (
        <Container>
            <div className={classes.stepDescriptionContainer}>
                <StepDescription
                    title="Enter shipping details"
                    description={
                        <div style={{ maxWidth: '342px' }}>
                            Select your preferred return shipping method and enter your return shipping address
                        </div>
                    }
                />
            </div>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Divider light />
                    <div className={classes.leftSideContainer}>
                        <div className={classes.shippingAddressContainer}>
                            <div className={classes.shippingAddressSectionHeader}>
                                <Typography className={classes.sectionLabel}>Shipping Address</Typography>
                                <FormControlLabel
                                    control={<GreenCheckbox checked={saveForLater} onChange={onSaveForLater} />}
                                    label="Save for later"
                                />
                            </div>

                            <div className={classes.inputsRow01}>
                                <div className={classes.fieldContainer} style={{ width: '47%' }}>
                                    <Typography className={classes.methodDescription}>First Name</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter First Name"
                                        value={firstName}
                                        onChange={(e: any) => updateField('firstName', e.target.value)}
                                        fullWidth
                                        size={'small'}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <div className={classes.fieldContainer} style={{ width: '47%' }}>
                                    <Typography className={classes.methodDescription}>Last Name</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter Last Name"
                                        value={lastName}
                                        onChange={(e: any) => updateField('lastName', e.target.value)}
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
                                <div className={classes.fieldContainer} style={{ width: '80%' }}>
                                    <Typography className={classes.methodDescription}>Address</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter Street Address"
                                        fullWidth
                                        value={address}
                                        onChange={(e: any) => updateField('address', e.target.value)}
                                        size={'small'}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <div className={classes.fieldContainer} style={{ width: '18%', marginTop: '4px' }}>
                                    <Typography className={classes.methodDescription}>Apt # (optional)</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Apt #"
                                        fullWidth
                                        value={apt}
                                        onChange={(e: any) => updateField('apt', e.target.value)}
                                        size={'small'}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={classes.inputsRow03}>
                                <div className={classes.fieldContainer} style={{ width: '30%' }}>
                                    <Typography className={classes.methodDescription}>City</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        value={city}
                                        onChange={(e: any) => updateField('city', e.target.value)}
                                        placeholder="Enter City"
                                        fullWidth
                                        size={'small'}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <div className={classes.fieldContainer} style={{ width: '32%', marginTop: '4px' }}>
                                    <Typography className={classes.methodDescription}>State</Typography>
                                    <Select
                                        fullWidth
                                        value={state.id || 'none'}
                                        onChange={(e: any) => updateShippingState(e.target.value)}
                                        placeholder={'Select State'}
                                        variant={'outlined'}
                                        style={{ height: '43px' }}
                                    >
                                        <MenuItem value="none">Select a state</MenuItem>
                                        {availableStates.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className={classes.fieldContainer} style={{ width: '32%' }}>
                                    <Typography className={classes.methodDescription}>Zip Code</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter Zip Code"
                                        fullWidth
                                        value={zipCode}
                                        onChange={(e: any) => updateField('zipCode', e.target.value)}
                                        size={'small'}
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={classes.inputsRow04}>
                                <div className={classes.fieldContainer} style={{ width: '100%', marginTop: '4px' }}>
                                    <Typography className={classes.methodDescription}>Phone Number</Typography>
                                    <NumberFormat
                                        customInput={TextField}
                                        format="+1 (###) ###-####"
                                        mask=""
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter Phone Number"
                                        value={phoneNumber}
                                        onChange={(e: any) => updateField('phoneNumber', e.target.value)}
                                        fullWidth
                                        variant={'outlined'}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </div>
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

export default SubmissionStep03Content;

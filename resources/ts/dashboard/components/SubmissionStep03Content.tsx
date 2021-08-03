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

export function SubmissionStep03Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();

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
                        <div className={classes.shippingMethodContainer}>
                            <Typography className={classes.sectionLabel}> Return Shipping Method </Typography>
                            <div className={classes.shippingMethodItemContainer}>
                                <Typography className={classes.methodDescription}>
                                    Robograding Shipping (Recommended)
                                </Typography>
                                <ShippingMethodItem isSelected={true} methodName={'Insured Shipping'} />
                            </div>
                            <div className={classes.shippingMethodItemContainer}>
                                <Typography className={classes.methodDescription} style={{ marginTop: '12px' }}>
                                    Alternate Shipping Methods
                                </Typography>
                                <ShippingMethodItem isSelected={false} methodName={'USPS Express Mail'} />
                            </div>
                            <div className={classes.shippingMethodItemContainer}>
                                <ShippingMethodItem isSelected={false} methodName={'FedEx'} />
                            </div>
                            <div className={classes.shippingMethodItemContainer}>
                                <ShippingMethodItem isSelected={false} methodName={'UPS'} />
                            </div>
                        </div>
                        <Divider light />
                        <div className={classes.shippingAddressContainer}>
                            <div className={classes.shippingAddressSectionHeader}>
                                <Typography className={classes.sectionLabel}>Shipping Address</Typography>
                                <FormControlLabel
                                    control={<GreenCheckbox checked={true} onChange={() => ''} name="checkedG" />}
                                    label="Save for later"
                                />
                            </div>

                            <div className={classes.inputsRow01}>
                                <div className={classes.fieldContainer} style={{ width: '47%' }}>
                                    <Typography className={classes.methodDescription}>First Name</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter First Name"
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
                                        value={'23'}
                                        fullWidth
                                        placeholder={'Select State'}
                                        variant={'outlined'}
                                        style={{ height: '43px' }}
                                        onChange={() => ''}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </div>
                                <div className={classes.fieldContainer} style={{ width: '32%' }}>
                                    <Typography className={classes.methodDescription}>Zip Code</Typography>
                                    <TextField
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Select Zip Code"
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

                            <div className={classes.inputsRow04}>
                                <div className={classes.fieldContainer} style={{ width: '100%', marginTop: '4px' }}>
                                    <Typography className={classes.methodDescription}>Phone Number</Typography>
                                    <TextField
                                        id="standard-full-width"
                                        style={{ margin: 8, marginLeft: 0 }}
                                        placeholder="Enter Phone Number"
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

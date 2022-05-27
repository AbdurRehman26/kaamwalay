import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { PaymentStatusChip } from '@shared/components/PaymentStatusChip';
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { APIService } from '@shared/services/APIService';
import { ApplyCredit } from '@dashboard/components/ApplyCredit';
import { ApplyPromoCode } from '@dashboard/components/ApplyPromoCode';
import { PaymentForm } from '@dashboard/components/PaymentForm';
import StripeContainer from '@dashboard/components/PaymentForm/StripeContainer';
import PaymentMethodItem from '@dashboard/components/PaymentMethodItem';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import {
    getAvailableCredit,
    getStatesList,
    orderToNewSubmission,
    setBillingAddress,
    setIsNextDisabled,
    setUseShippingAddressAsBilling,
    updateBillingAddressField,
    updatePaymentMethodId,
} from '@dashboard/redux/slices/newSubmissionSlice';
import { PaymentSummary } from './PaymentSummary';

const useStyles = makeStyles((theme) => ({
    paymentPageContainer: {
        padding: 0,
    },
    stepDescriptionContainer: {
        maxWidth: '425px',
        display: 'flex',
        minWidth: '100%',
        justifyContent: 'space-between',
        marginBottom: 20,
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
        marginTop: '24px',
    },
    sectionLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        marginBottom: '8px',
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
    title: {
        fontFamily: 'Roboto',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '36px',
        letterSpacing: '0px',
        textAlign: 'left',
        marginBottom: '6px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '20px',
        },
    },
    description: {
        fontFamily: 'Roboto',
        color: '#212121',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '20px',
        letterSpacing: '0.2px',
        textAlign: 'left',
        marginBottom: '32px',
    },
    backIcon: {
        width: 20,
        height: 24,
        marginRight: 22,
        cursor: 'pointer',
    },
    billingAddressButtonContainer: {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
    },
}));

const GreenCheckbox = withStyles({
    root: {
        color: '#20BFB8',
        '&$checked': {
            color: '#20BFB8',
        },
    },
    checked: {},
})((props: any) => <Checkbox color="default" {...props} />);

const schema = yup.object().shape({
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
});

function addressFromEntity(address: AddressEntity) {
    return {
        id: address.id,
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        city: address.city,
        zipCode: address.zip,
        phoneNumber: address.phone,
        flat: address.flat,
        country: {
            id: address.country?.id,
            name: address.country?.name,
            code: address.country?.code,
        },
        state: {
            id: 0,
            name: address.state,
            code: address.state,
        },
    };
}

export function Payment() {
    const { id } = useParams<'id'>();
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const apiService = useInjectable(APIService);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
    const [arePaymentMethodsLoading, setArePaymentMethodsLoading] = useState(false);
    const paymentMethodId = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const currentSelectedStripeCardId = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.id);

    const useBillingAddressSameAsShipping = useAppSelector(
        (state) => state.newSubmission.step04Data.useShippingAddressAsBillingAddress,
    );

    const existingAddresses = useAppSelector((state) => state.newSubmission.step03Data.existingAddresses);
    const selectedExistingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedExistingAddress);
    const useCustomShippingAddress = useAppSelector((state) => state.newSubmission.step03Data.useCustomShippingAddress);
    const firstName = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.firstName);
    const lastName = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.lastName);
    const address = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.address);
    const city = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.city);
    const state = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.state);
    const zipCode = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.zipCode);
    const apt = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.flat);
    const availableStates = useAppSelector((state) => state.newSubmission.step03Data?.availableStatesList);
    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);
    const [isAddressDataValid, setIsAddressDataValid] = useState(false);
    const paymentStatus = useAppSelector((state) => state.newSubmission.paymentStatus);
    const navigate = useNavigate();
    const [isUpdateAddressButtonEnabled, setIsUpdateAddressButtonEnabled] = useState(false);
    const [canUseShippingAsBilling, setCanUseShippingAsBilling] = useState(true);
    const notifications = useNotifications();

    const order = useOrderQuery({
        resourceId: Number(id),
        config: {
            params: {
                include: [
                    'paymentPlan',
                    'originalPaymentPlan',
                    'orderStatusHistory',
                    'orderCustomerShipment',
                    'orderStatusHistory.orderStatus',
                    'invoice',
                    'extraCharges',
                    'refunds',
                    'orderShipment',
                    'orderItems',
                    'orderStatus',
                    'coupon',
                ],
            },
        },
    });

    const shippingAddress = useMemo(
        () => order.data?.billingAddress || order.data?.shippingAddress || ({} as any),
        [order.data?.shippingAddress, order.data?.billingAddress],
    );

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
            })
            .then((valid) => {
                setIsUpdateAddressButtonEnabled(valid);
                setIsAddressDataValid(valid);
            });
    }, [
        firstName,
        lastName,
        address,
        apt,
        city,
        state,
        zipCode,
        selectedExistingAddress,
        useCustomShippingAddress,
        existingAddresses,
        useBillingAddressSameAsShipping,
    ]);

    const onUseShippingAddressAsBilling = useCallback(() => {
        dispatch(setUseShippingAddressAsBilling(!useBillingAddressSameAsShipping));
        if (!useBillingAddressSameAsShipping) {
            dispatch(setBillingAddress(addressFromEntity(shippingAddress)));
        }
    }, [dispatch, shippingAddress, useBillingAddressSameAsShipping]);

    const updateField = useCallback(
        (fieldName: any, newValue: any) => {
            dispatch(updateBillingAddressField({ fieldName, newValue }));
        },
        [dispatch],
    );

    const updateBillingState = useCallback(
        (stateId: any) => {
            const stateLookup = availableStates.find((state: any) => state.id === parseInt(stateId));
            if (stateLookup) {
                dispatch(
                    updateBillingAddressField({
                        fieldName: 'state',
                        newValue: { name: stateLookup.name, id: stateLookup.id, code: stateLookup.code },
                    }),
                );
            }
        },
        [availableStates, dispatch],
    );

    async function getPaymentMethods() {
        setArePaymentMethodsLoading(true);
        const endpoint = apiService.createEndpoint('customer/orders/payment-methods');
        const response = await endpoint.get('');
        dispatch(updatePaymentMethodId(response.data[0].id));
        setAvailablePaymentMethods(response.data);
        setArePaymentMethodsLoading(false);
    }

    async function updateBillingAddress() {
        setIsUpdateAddressButtonEnabled(false);
        const endpoint = apiService.createEndpoint(`customer/orders/${id}/update-billing-address`);
        const response = await endpoint.patch('', {
            firstName,
            lastName,
            address,
            apt,
            city,
            phone: order?.data.shippingAddress.phone,
            zip: zipCode,
            state: state.code,
        });
        notifications.success(response?.data?.message);
        setCanUseShippingAsBilling(false);
        setIsUpdateAddressButtonEnabled(true);
    }

    useEffect(
        () => {
            dispatch(getStatesList());
            getPaymentMethods();
            dispatch(getAvailableCredit()).unwrap();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(
        () => {
            if (order.data?.paymentStatus === PaymentStatusEnum.PAID) {
                navigate('/submissions/' + order.data.id + '/view');
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [order],
    );

    useEffect(() => {
        dispatch(setIsNextDisabled(true));
        if (paymentMethodId === 1) {
            dispatch(setIsNextDisabled(currentSelectedStripeCardId.length === 0 || !isAddressDataValid));
        }

        if (paymentMethodId === 2) {
            dispatch(setIsNextDisabled(false));
        }

        if (paymentMethodId === 3) {
            dispatch(setIsNextDisabled(false));
        }
    }, [dispatch, isAddressDataValid, paymentMethodId, useBillingAddressSameAsShipping, currentSelectedStripeCardId]);

    useEffect(
        () => {
            if (useBillingAddressSameAsShipping) {
                dispatch(setBillingAddress(addressFromEntity(shippingAddress)));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch],
    );

    useEffect(
        () => {
            if (order.data) {
                dispatch(orderToNewSubmission(order.data));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [order.data],
    );

    if (order.isLoading || order.isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {order.isLoading ? (
                    <CircularProgress />
                ) : (
                    <Typography color={'error'}>Error loading submission</Typography>
                )}
            </Box>
        );
    }

    return (
        <StripeContainer>
            <Container className={classes.paymentPageContainer}>
                <div className={classes.stepDescriptionContainer}>
                    <div>
                        <Typography variant={'h2'} className={classes.title}>
                            <ArrowBackIcon className={classes.backIcon} onClick={() => navigate(-1)} />
                            Pay For Submission
                        </Typography>
                    </div>

                    <PaymentStatusChip
                        color={paymentStatus}
                        label={PaymentStatusMap[paymentStatus]}
                        mode={'customer'}
                    />
                </div>

                <Divider light />

                <Grid container spacing={1}>
                    <Grid item xs={12} md={7}>
                        <Divider light />
                        <div className={classes.leftSideContainer}>
                            {availableCredit > 0 ? (
                                <div className={classes.shippingMethodContainer}>
                                    <Typography className={classes.sectionLabel} style={{ marginBottom: '3px' }}>
                                        Apply Credit
                                    </Typography>
                                    <Typography variant={'caption'} className={classes.availableCreditLabel}>
                                        You have <span style={{ fontWeight: 'bold' }}>${availableCredit}</span> in
                                        available credit.
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
                            <div className={classes.shippingMethodContainer}>
                                <Typography className={classes.sectionLabel}> Select Payment Method </Typography>

                                <div className={classes.shippingMethodItemContainer}>
                                    {arePaymentMethodsLoading ? (
                                        <div className={classes.loaderContainer}>
                                            <CircularProgress color={'secondary'} />
                                        </div>
                                    ) : null}
                                    {availablePaymentMethods.map((item: any) => (
                                        <PaymentMethodItem
                                            key={item.id}
                                            isSelected={paymentMethodId === item.id}
                                            methodName={item.name}
                                            methodId={item.id}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Divider light />
                            {paymentMethodId === 1 ? (
                                <>
                                    <div className={classes.sectionContainer}>
                                        <PaymentForm />
                                    </div>
                                    <div className={classes.billingAddressAsShippingContainer}>
                                        {canUseShippingAsBilling ? (
                                            <FormControlLabel
                                                control={
                                                    <GreenCheckbox
                                                        checked={useBillingAddressSameAsShipping}
                                                        onChange={onUseShippingAddressAsBilling}
                                                    />
                                                }
                                                label="Billing address same as shipping"
                                            />
                                        ) : null}
                                        {useBillingAddressSameAsShipping ? (
                                            <>
                                                <Typography className={classes.billingAddressTitle}>
                                                    Billing Address
                                                </Typography>
                                                <Typography
                                                    className={classes.billingAddressItem}
                                                >{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</Typography>
                                                <Typography className={classes.billingAddressItem}>{`${
                                                    shippingAddress.address
                                                } ${
                                                    shippingAddress?.flat ? `apt: ${shippingAddress.flat}` : ''
                                                }`}</Typography>
                                                <Typography className={classes.billingAddressItem}>{`${
                                                    shippingAddress.city
                                                }, ${shippingAddress.state} ${shippingAddress.zip}, ${
                                                    shippingAddress.country?.code ?? ''
                                                }`}</Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Divider light />
                                                <div className={classes.sectionContainer}>
                                                    <div className={classes.shippingAddressSectionHeader}>
                                                        <Typography className={classes.sectionLabel}>
                                                            Billing Address
                                                        </Typography>
                                                    </div>

                                                    <div className={classes.inputsRow01}>
                                                        <div
                                                            className={classes.fieldContainer}
                                                            style={{ width: '47%' }}
                                                        >
                                                            <Typography className={classes.methodDescription}>
                                                                First Name
                                                            </Typography>
                                                            <TextField
                                                                style={{ margin: 8, marginLeft: 0 }}
                                                                placeholder="Enter First Name"
                                                                value={firstName}
                                                                onChange={(e: any) =>
                                                                    updateField('firstName', e.target.value)
                                                                }
                                                                fullWidth
                                                                size={'small'}
                                                                variant={'outlined'}
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </div>
                                                        <div
                                                            className={classes.fieldContainer}
                                                            style={{ width: '47%' }}
                                                        >
                                                            <Typography className={classes.methodDescription}>
                                                                Last Name
                                                            </Typography>
                                                            <TextField
                                                                style={{ margin: 8, marginLeft: 0 }}
                                                                placeholder="Enter Last Name"
                                                                value={lastName}
                                                                onChange={(e: any) =>
                                                                    updateField('lastName', e.target.value)
                                                                }
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
                                                        <div
                                                            className={`${classes.fieldContainer} ${classes.addressFieldContainer}`}
                                                        >
                                                            <Typography className={classes.methodDescription}>
                                                                Address
                                                            </Typography>
                                                            <TextField
                                                                style={{ margin: 8, marginLeft: 0 }}
                                                                placeholder="Enter Street Address"
                                                                fullWidth
                                                                value={address}
                                                                onChange={(e: any) =>
                                                                    updateField('address', e.target.value)
                                                                }
                                                                size={'small'}
                                                                variant={'outlined'}
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </div>
                                                        {!isMobile ? (
                                                            <div
                                                                className={`${classes.fieldContainer} ${classes.aptFieldContainer}`}
                                                            >
                                                                <Typography className={classes.methodDescription}>
                                                                    Apt # (optional)
                                                                </Typography>
                                                                <TextField
                                                                    style={{ margin: 8, marginLeft: 0 }}
                                                                    placeholder="Apt #"
                                                                    fullWidth
                                                                    value={apt}
                                                                    onChange={(e: any) =>
                                                                        updateField('flat', e.target.value)
                                                                    }
                                                                    size={'small'}
                                                                    variant={'outlined'}
                                                                    margin="normal"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    {isMobile ? (
                                                        <div className={classes.inputsRow02}>
                                                            <div
                                                                className={`${classes.fieldContainer} ${classes.aptFieldContainer}`}
                                                            >
                                                                <Typography className={classes.methodDescription}>
                                                                    Apt # (optional)
                                                                </Typography>
                                                                <TextField
                                                                    style={{ margin: 8, marginLeft: 0 }}
                                                                    placeholder="Apt #"
                                                                    fullWidth
                                                                    value={apt}
                                                                    onChange={(e: any) =>
                                                                        updateField('flat', e.target.value)
                                                                    }
                                                                    size={'small'}
                                                                    variant={'outlined'}
                                                                    margin="normal"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                    {isMobile ? (
                                                        <div className={classes.inputsRow03}>
                                                            <div
                                                                className={`${classes.fieldContainer} ${classes.cityFieldContainer} `}
                                                            >
                                                                <Typography className={classes.methodDescription}>
                                                                    City
                                                                </Typography>
                                                                <TextField
                                                                    style={{ margin: 8, marginLeft: 0 }}
                                                                    value={city}
                                                                    onChange={(e: any) =>
                                                                        updateField('city', e.target.value)
                                                                    }
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
                                                        </div>
                                                    ) : null}

                                                    <div className={classes.inputsRow03}>
                                                        {!isMobile ? (
                                                            <div
                                                                className={`${classes.fieldContainer} ${classes.cityFieldContainer}`}
                                                            >
                                                                <Typography className={classes.methodDescription}>
                                                                    City
                                                                </Typography>
                                                                <TextField
                                                                    style={{ margin: 8, marginLeft: 0 }}
                                                                    value={city}
                                                                    onChange={(e: any) =>
                                                                        updateField('city', e.target.value)
                                                                    }
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
                                                        ) : null}

                                                        <div
                                                            className={`${classes.fieldContainer} ${classes.stateFieldContainer}`}
                                                        >
                                                            <Typography className={classes.methodDescription}>
                                                                State
                                                            </Typography>
                                                            <Select
                                                                fullWidth
                                                                native
                                                                value={state.id || 'none'}
                                                                onChange={(e: any) =>
                                                                    updateBillingState(e.nativeEvent.target.value)
                                                                }
                                                                placeholder={'Select State'}
                                                                variant={'outlined'}
                                                                style={{ height: '43px' }}
                                                            >
                                                                <option value="none">Select a state</option>
                                                                {availableStates.map((item: any) => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.code}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                        <div
                                                            className={`${classes.fieldContainer} ${classes.zipFieldContainer}`}
                                                        >
                                                            <Typography className={classes.methodDescription}>
                                                                Zip Code
                                                            </Typography>
                                                            <TextField
                                                                style={{ margin: 8, marginLeft: 0 }}
                                                                placeholder="Enter Zip Code"
                                                                fullWidth
                                                                value={zipCode}
                                                                onChange={(e: any) =>
                                                                    updateField('zipCode', e.target.value)
                                                                }
                                                                size={'small'}
                                                                variant={'outlined'}
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={classes.billingAddressButtonContainer}>
                                                        <Button
                                                            variant={'contained'}
                                                            disabled={!isUpdateAddressButtonEnabled}
                                                            onClick={updateBillingAddress}
                                                        >
                                                            Update Billing Address
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : null}
                            {paymentMethodId === 2 ? (
                                <div className={classes.sectionContainer}>
                                    <Typography className={classes.sectionLabel}>Paypal</Typography>
                                    <Typography variant={'subtitle2'}>
                                        You will be redirected to the PayPal site after reviewing your order.{' '}
                                    </Typography>
                                </div>
                            ) : null}

                            {paymentMethodId === 3 ? (
                                <div className={classes.sectionContainer}>
                                    <Typography className={classes.sectionLabel}>Pay with Collector Coin</Typography>
                                    <Typography variant={'subtitle2'}>
                                        Instructions for how to pay with Collector Coin will be provided in the next
                                        step.
                                    </Typography>
                                    <Typography variant={'subtitle2'}>
                                        All you need is a MetaMask crypto wallet
                                    </Typography>
                                </div>
                            ) : null}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PaymentSummary />
                    </Grid>
                </Grid>

                <Divider light className={classes.divider} />
            </Container>
        </StripeContainer>
    );
}

export default Payment;

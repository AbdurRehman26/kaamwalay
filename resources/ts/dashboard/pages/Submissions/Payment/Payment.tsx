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
import NumberFormat from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { PaymentStatusChip } from '@shared/components/PaymentStatusChip';
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { AddressEntity } from '@shared/entities/AddressEntity';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { APIService } from '@shared/services/APIService';
import { ApplyCredit } from '@dashboard/components/ApplyCredit';
import { ApplyPromoCode } from '@dashboard/components/ApplyPromoCode';
import PayNowStatusNotice from '@dashboard/components/PayNow/PayNowStatusNotice';
import { PaymentForm } from '@dashboard/components/PaymentForm';
import StripeContainer from '@dashboard/components/PaymentForm/StripeContainer';
import PaymentMethodItem from '@dashboard/components/PaymentMethodItem';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { getCountriesList } from '@dashboard/redux/slices/newAddressSlice';
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
        marginBottom: '15px',
        marginTop: '20px',
        [theme.breakpoints.down('sm')]: {
            display: 'block',
            marginTop: '0px',
        },
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
        fontWeight: 500,
        lineHeight: '36px',
        letterSpacing: '0px',
        textAlign: 'left',
        marginBottom: '6px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '20px',
        },
    },
    titleDiv: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '15px',
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
        verticalAlign: 'middle',
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
    fullName: yup.string().required(),
    address: yup.string().required(),
    address2: yup.string().optional().nullable(),
    city: yup.string().required(),
    state: yup.string().required(),
    zipCode: yup.string().required(),
});

function addressFromEntity(address: AddressEntity) {
    return {
        id: address.id,
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        address2: address.address2,
        city: address.city,
        zipCode: address.zip,
        phoneNumber: address.phone,
        flat: address.flat,
        country: {
            id: address.country?.id,
            name: address.country?.name,
            code: address.country?.code,
            phoneCode: address.country?.phoneCode,
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

    const availableCountries = useAppSelector((state) => state.newAddressSlice.availableCountriesList);
    const existingAddresses = useAppSelector((state) => state.newSubmission.step03Data.existingAddresses);
    const selectedExistingAddress = useAppSelector((state) => state.newSubmission.step03Data.selectedExistingAddress);
    const useCustomShippingAddress = useAppSelector((state) => state.newSubmission.step03Data.useCustomShippingAddress);
    const fullName = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.fullName);
    const address = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.address);
    const address2 = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.address2);
    const country = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.country);
    const city = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.city);
    const state = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.state);
    const zipCode = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.zipCode);
    const phoneNumber = useAppSelector((state) => state.newSubmission.step04Data.selectedBillingAddress.phoneNumber);
    const availableStates = useAppSelector((state) => state.newSubmission.step03Data?.availableStatesList);
    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);
    const amountPaidFromWallet = useAppSelector((state) => state.newSubmission.amountPaidFromWallet);
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
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

    const endTime = new Date(new Date(order.data?.createdAt).getTime() + 86400000);
    const timeInMs = new Date() <= endTime ? new Date(order.data?.createdAt).getTime() + 86400000 : 0;
    const { featureOrderWalletCreditEnabled, featureOrderWalletCreditPercentage } = useConfiguration();

    useEffect(
        () => {
            (async () => {
                await dispatch(getCountriesList());
                await dispatch(getStatesList());
            })();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        schema
            .isValid({
                fullName,
                address,
                address2,
                city,
                state: state?.code ?? state,
                zipCode,
            })
            .then((valid) => {
                setIsUpdateAddressButtonEnabled(valid);
                setIsAddressDataValid(valid);
            });
    }, [
        fullName,
        address,
        address2,
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

    const updateBillingCountry = useCallback(
        (countryId: any) => {
            const countryLookup = availableCountries.find((country: any) => country.id === parseInt(countryId));
            if (countryLookup) {
                dispatch(
                    updateBillingAddressField({
                        fieldName: 'country',
                        newValue: {
                            name: countryLookup.name,
                            id: countryLookup.id,
                            code: countryLookup.code,
                            phoneCode: countryLookup.phoneCode,
                        },
                    }),
                );
            }
        },
        [availableCountries, dispatch],
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
    const getStateValue = useCallback(
        (code: any) => {
            const stateLookup = availableStates.find((state: any) => state.code === code);
            if (stateLookup) {
                return stateLookup.id;
            } else {
                return code;
            }
        },
        [availableStates],
    );

    async function getPaymentMethods() {
        setArePaymentMethodsLoading(true);
        const endpoint = apiService.createEndpoint('customer/orders/payment-methods');
        const response = await endpoint.get('');
        dispatch(updatePaymentMethodId(response.data[0].id));
        setAvailablePaymentMethods(response.data);
        setArePaymentMethodsLoading(false);
    }

    const parseName = (fullName: any) => {
        const value = fullName.trim();
        const firstSpace = value.indexOf(' ');
        if (firstSpace === -1) {
            return { firstName: value, lastName: null };
        }

        const firstName = value.slice(0, firstSpace);
        const lastName = value.slice(firstSpace + 1);

        return { firstName, lastName };
    };

    async function updateBillingAddress() {
        setIsUpdateAddressButtonEnabled(false);
        const endpoint = apiService.createEndpoint(`customer/orders/${id}/update-billing-address`);
        const parsedName = parseName(fullName);

        const response = await endpoint.patch('', {
            firstName: parsedName?.firstName,
            lastName: parsedName?.lastName,
            address,
            address2,
            city,
            state: state?.code ?? state,
            zip: zipCode,
            phone: phoneNumber,
            countryCode: country?.code ? country.code : 'US',
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
                    <div className={classes.titleDiv}>
                        <Typography variant={'h2'} className={classes.title}>
                            <ArrowBackIcon className={classes.backIcon} onClick={() => navigate(-1)} />
                            Pay For Submission
                        </Typography>
                    </div>
                    {timeInMs !== 0 && featureOrderWalletCreditEnabled ? (
                        <PayNowStatusNotice
                            id={order.data?.id}
                            countdownTimestampMs={timeInMs}
                            isConfirmationPage={false}
                            isPayPage={true}
                            isCoupon={isCouponApplied}
                        />
                    ) : (
                        <PaymentStatusChip
                            color={paymentStatus}
                            label={PaymentStatusMap[paymentStatus]}
                            mode={'customer'}
                        />
                    )}
                </div>

                <Divider light />

                <Grid container spacing={1}>
                    <Grid item xs={12} md={7}>
                        <div className={classes.leftSideContainer}>
                            {availableCredit > 0 || amountPaidFromWallet > 0 ? (
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
                                        {Object.keys(shippingAddress).length !== 0 && canUseShippingAsBilling ? (
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
                                        {Object.keys(shippingAddress).length !== 0 &&
                                        useBillingAddressSameAsShipping ? (
                                            <>
                                                <Typography className={classes.billingAddressTitle}>
                                                    Billing Address
                                                </Typography>
                                                <Typography
                                                    className={classes.billingAddressItem}
                                                >{`${shippingAddress.getFullName()}`}</Typography>
                                                <Typography className={classes.billingAddressItem}>{`${
                                                    shippingAddress.address
                                                } ${
                                                    shippingAddress?.address2 ? shippingAddress.address2 : ''
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
                                                    <div className={classes.fieldContainer} style={{ width: '100%' }}>
                                                        <Typography className={classes.methodDescription}>
                                                            Country
                                                        </Typography>
                                                        <Select
                                                            fullWidth
                                                            native
                                                            key={`billingAddressCountry${id}`}
                                                            name={`billingAddressCountry${id}`}
                                                            id={`billingAddressCountry${id}`}
                                                            onChange={(e) => {
                                                                updateField('phoneNumber', '');
                                                                updateBillingCountry(e.target.value);
                                                            }}
                                                            placeholder={'Select Country'}
                                                            variant={'outlined'}
                                                            style={{ height: '43px', marginTop: 6 }}
                                                            value={country?.id}
                                                        >
                                                            <option value="none">Select a country</option>
                                                            {availableCountries.map((item: any) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item?.name}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    <div className={classes.inputsRow02}>
                                                        <div
                                                            className={classes.fieldContainer}
                                                            style={{ width: '100%' }}
                                                        >
                                                            <Typography className={classes.methodDescription}>
                                                                Full Name
                                                            </Typography>
                                                            <TextField
                                                                style={{ margin: 8, marginLeft: 0 }}
                                                                placeholder="Enter Full Name"
                                                                value={fullName}
                                                                onChange={(e: any) =>
                                                                    updateField('fullName', e.target.value)
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
                                                            style={{ width: '100%' }}
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
                                                    </div>
                                                    <div className={'inputsRow02'}>
                                                        <div
                                                            className={`${classes.fieldContainer} ${classes.addressFieldContainer}`}
                                                            style={{ width: '100%' }}
                                                        >
                                                            <Typography className={classes.methodDescription}>
                                                                Address Line #2 (Optional)
                                                            </Typography>
                                                            <TextField
                                                                style={{ margin: 8, marginLeft: 0 }}
                                                                placeholder="Enter apt, suite, building, floor etc."
                                                                fullWidth
                                                                value={address2}
                                                                onChange={(e: any) =>
                                                                    updateField('address2', e.target.value)
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
                                                            {country?.id === 1 || !country?.id ? (
                                                                <Select
                                                                    fullWidth
                                                                    native
                                                                    value={getStateValue(state?.code ?? state)}
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
                                                            ) : (
                                                                <TextField
                                                                    style={{ marginTop: 2 }}
                                                                    placeholder="Enter State"
                                                                    fullWidth
                                                                    onChange={(e: any) => {
                                                                        dispatch(
                                                                            updateBillingAddressField({
                                                                                fieldName: 'state',
                                                                                newValue: e.target.value,
                                                                            }),
                                                                        );
                                                                    }}
                                                                    value={state?.code ?? state}
                                                                    size={'small'}
                                                                    variant={'outlined'}
                                                                    margin="normal"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                />
                                                            )}
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
                                                    <div className={'inputsRow04'}>
                                                        <div
                                                            className={'fieldContainer'}
                                                            style={{ width: '100%', marginTop: '4px' }}
                                                        >
                                                            <Typography className={classes.methodDescription}>
                                                                Phone Number (Optional)
                                                            </Typography>
                                                            <NumberFormat
                                                                customInput={TextField}
                                                                format={
                                                                    country.phoneCode
                                                                        ? '+' + country.phoneCode + ' (###) ###-####'
                                                                        : '+' +
                                                                          availableCountries[0].phoneCode +
                                                                          ' (###) ###-####'
                                                                }
                                                                mask=""
                                                                style={{ margin: 8, marginLeft: 0 }}
                                                                placeholder="Enter Phone Number"
                                                                onChange={(e: any) =>
                                                                    updateField('phoneNumber', e.target.value)
                                                                }
                                                                value={phoneNumber}
                                                                fullWidth
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
                                        All you need is a MetaMask crypto wallet.
                                    </Typography>
                                </div>
                            ) : null}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PaymentSummary
                            timeInMs={timeInMs}
                            featureOrderWalletCreditPercentage={featureOrderWalletCreditPercentage}
                            featureOrderWalletCreditEnabled={featureOrderWalletCreditEnabled}
                        />
                    </Grid>
                </Grid>

                <Divider light className={classes.divider} />
            </Container>
        </StripeContainer>
    );
}

export default Payment;

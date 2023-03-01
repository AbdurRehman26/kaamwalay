import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useAppDispatch, useAppSelector } from '@salesrep/redux/hooks';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { NumberFormatTextField } from '@shared/components/NumberFormatTextField';
import { CardsSelectionEvents, EventCategories, PaymentMethodEvents } from '@shared/constants/GAEventsTypes';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { DefaultShippingMethodEntity } from '@shared/entities/ShippingMethodEntity';
import {
    SearchResultItemCardProps,
    changeSelectedCardQty,
    changeSelectedCardValue,
    clearSubmissionState,
    createOrder,
    getShippingFee,
    markCardAsUnselected,
    resetSelectedCards,
    setBillingAddress,
    setIsCouponApplied,
    setPreviewTotal,
} from '@shared/redux/slices/salesRepCreateOrderSlice';
import { NotificationsService } from '@shared/services/NotificationsService';
import SearchResultItemCard from './SearchResultItemCard';

const useStyles = makeStyles((theme) => ({
    addedCardsContainer: {
        border: '1px solid #E0E0E0',
        borderWidth: '0 1px 1px',
    },
    label: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    emptyStateContainer: {
        width: '100%',
        height: '153px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emptyStateText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    qtyField: {
        width: '95%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    valueField: {
        width: '150px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    table: {
        minWidth: '100%',
    },
    lastrow: {
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowLeftText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '16px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    editBtn: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.35px',
        marginLeft: '12px',
        '&:hover': {
            cursor: 'pointer',
        },
        color: '#20BFB8',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tableRowText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'right',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    mobileViewContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '12px',
    },
    rowRightBoldText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '20px',
        textAlign: 'right',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    paymentContainer: {
        padding: '20px',
    },
    mobileViewCardActionContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '45%',
    },
    mobileViewCardActions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '24px',
        marginBottom: '12px',
    },
    actionLabel: {
        fontWeight: 'bold',
        marginBottom: '6px',
    },
    textColorSecondary: {
        color: '#0000008A',
    },
    dialogActions: {
        marginBottom: '12px',
        marginRight: '18px',
    },
    contentContainer: {
        width: '457px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    saveBtn: {
        marginLeft: '12px',
    },
    parent: {
        overflowY: 'scroll',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
            window: '0px',
        },
    },
    valueAlert: {
        marginTop: '16px',
    },
}));

export function AddedSubmissionCards() {
    const [isClearCard, setIsClearCard] = useState<boolean>(false);
    const [isCreateSubmission, setIsCreateSubmission] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const classes = useStyles();
    const useCustomShippingAddress = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.step03Data.useCustomShippingAddress,
    );
    const existingAddresses = useAppSelector((state) => state.salesRepCreateOrderSlice.step03Data.existingAddresses);
    const selectedCards = useAppSelector((state) => state.salesRepCreateOrderSlice.step02Data.selectedCards);
    const serviceLevelPrice = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.step01Data?.selectedServiceLevel.price,
    );
    const priceRanges = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.step01Data?.selectedServiceLevel.priceRanges,
    );
    const protectionLimit = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.step01Data?.selectedServiceLevel.maxProtectionAmount,
    );
    const selectedExistingAddress = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.step03Data.selectedExistingAddress,
    );
    const shippingAddress = useAppSelector((state) => state.salesRepCreateOrderSlice.step03Data.selectedAddress);
    const isNextDisabled = useAppSelector((state) => state.salesRepCreateOrderSlice.isNextDisabled);
    const isCouponApplied = useAppSelector((state) => state.salesRepCreateOrderSlice.couponState.isCouponApplied);
    const userId = useAppSelector((state) => state.salesRepCreateOrderSlice.user.id);
    const appliedCredit = useAppSelector((state) => state.salesRepCreateOrderSlice.appliedCredit);
    const shippingMethod = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.shippingMethod || DefaultShippingMethodEntity,
        (a, b) => a?.id === b?.id && a?.code === b?.code,
    );
    const discountedValue = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.couponState.appliedCouponData.discountedAmount,
    );
    const shippingFee = useAppSelector((state) => state.salesRepCreateOrderSlice.step02Data.shippingFee);
    const cleaningFee = useAppSelector((state) => state.salesRepCreateOrderSlice.step02Data.cleaningFee);

    const finalShippingAddress =
        existingAddresses.length !== 0 && !useCustomShippingAddress && selectedExistingAddress.id !== 0
            ? selectedExistingAddress
            : shippingAddress;

    const areSelectedCardsValuesValid = useCallback(() => {
        if (selectedCards?.length > 0) {
            // @ts-ignore
            const cardsWithValueHigherThanProtection = selectedCards.filter(
                (card: Record<string, any>) => card?.value > protectionLimit,
            );

            return cardsWithValueHigherThanProtection.length === 0;
        }
        return true;
    }, [selectedCards, protectionLimit]);

    useEffect(() => {
        if (
            userId !== -1 &&
            selectedCards.length > 0 &&
            (isNextDisabled ||
                selectedExistingAddress.address !== '' ||
                shippingMethod.code === ShippingMethodType.VaultStorage) &&
            areSelectedCardsValuesValid() &&
            selectedCards.filter((card: Record<string, any>) => card.qty === 0).length === 0
        ) {
            setIsCreateSubmission(true);
            dispatch(getShippingFee(selectedCards));
        } else {
            setIsCreateSubmission(false);
        }
    }, [
        selectedCards,
        isNextDisabled,
        userId,
        isCreateSubmission,
        selectedExistingAddress,
        dispatch,
        shippingMethod.code,
        areSelectedCardsValuesValid,
    ]);

    const numberOfSelectedCards =
        selectedCards.length !== 0
            ? selectedCards.reduce(function (prev: number, cur: any) {
                  // @ts-ignore
                  return prev + cur?.qty;
              }, 0)
            : 0;

    let finalPrice =
        priceRanges?.filter((item: any) => {
            if (
                (numberOfSelectedCards >= item.minCards && numberOfSelectedCards <= item.maxCards) ||
                (numberOfSelectedCards >= item.minCards && item.maxCards === null)
            ) {
                return item;
            }
        }) ?? null;

    finalPrice = finalPrice ? finalPrice[0]?.price : serviceLevelPrice;

    const handleDeselectCard = useCallback(
        (row: { id: number }) => {
            ReactGA.event({ category: EventCategories.Cards, action: CardsSelectionEvents.removed });
            dispatch(markCardAsUnselected(row));
            if (isCouponApplied) {
                dispatch(setIsCouponApplied(false));
            }
        },
        [dispatch, isCouponApplied],
    );

    function handleChangeCardQty(card: SearchResultItemCardProps, qty: any) {
        const value = String(qty).replace(/[^\d]/, '');
        const newValue = Math.min(Number(value), 100);
        dispatch(changeSelectedCardQty({ card, qty: newValue }));
        if (isCouponApplied) {
            dispatch(setIsCouponApplied(false));
        }
    }

    function handleChangeCardValue(card: SearchResultItemCardProps, newValue: any) {
        // replace non-digits with, if user enters a decimal
        const receivedValue = String(newValue).replace(/[^\d]/, '');
        const valueAsInt = parseInt(receivedValue);
        const finalValue = Math.min(Math.max(valueAsInt, 1), 1000000);
        dispatch(changeSelectedCardValue({ card, newValue: finalValue }));
    }

    const createSubmission = async () => {
        try {
            dispatch(setBillingAddress(finalShippingAddress));
            ReactGA.event({
                category: EventCategories.Submissions,
                action: PaymentMethodEvents.payLater,
            });
            setIsLoading(true);
            const order = await dispatch(createOrder()).unwrap();
            NotificationsService.success('Order Placed Successfully!');
            setIsLoading(false);
            dispatch(clearSubmissionState());
            window.location.href = `/salesrep/submissions/${order.id}/view`;
        } catch (e: any) {
            setIsLoading(false);
            NotificationsService.exception(e);
        }
    };

    const clearAllCards = () => {
        dispatch(resetSelectedCards([]));
    };

    function getPreviewTotal() {
        const previewTotal =
            numberOfSelectedCards * finalPrice +
            Number(cleaningFee) +
            shippingFee -
            Number(isCouponApplied ? discountedValue : 0) -
            appliedCredit;
        dispatch(setPreviewTotal(previewTotal));
        return previewTotal;
    }

    return (
        <div className={classes.addedCardsContainer}>
            <Dialog open={isClearCard} onClose={() => setIsClearCard(false)}>
                <DialogTitle>Are you sure you want to clear all cards?</DialogTitle>
                <Formik initialValues={{}} onSubmit={clearAllCards}>
                    {({ isSubmitting }) => (
                        <Form>
                            <DialogContent className={classes.contentContainer}></DialogContent>
                            <DialogActions className={classes.dialogActions}>
                                <Button disabled={isSubmitting} onClick={() => setIsClearCard(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type={'submit'}
                                    color={'primary'}
                                    variant={'contained'}
                                    size={'medium'}
                                    className={classes.saveBtn}
                                    startIcon={isSubmitting ? <CircularProgress size={20} color={'inherit'} /> : null}
                                >
                                    Clear
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            <Grid sx={{ borderBottom: '1px solid #E0E0E0' }} container alignItems={'center'} p={2}>
                <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>Added Cards</Typography>
                <IconButton onClick={() => setIsClearCard(true)} sx={{ marginLeft: 'auto' }}>
                    <ClearAllOutlinedIcon />
                </IconButton>
            </Grid>
            <div className={classes.parent} style={{ height: selectedCards.length > 3 ? '72vh' : 'auto' }}>
                {selectedCards
                    .slice()
                    .reverse()
                    .map((row: SearchResultItemCardProps) => (
                        <div key={row.id}>
                            <Grid p={1}>
                                <Grid item display={'flex'} flexDirection={'row'}>
                                    <Grid md={11}>
                                        <SearchResultItemCard
                                            key={row.id}
                                            id={row.id}
                                            image={row.image}
                                            longName={row.longName}
                                            shortName={row.shortName}
                                            name={row.name}
                                            addedMode
                                        />
                                    </Grid>
                                    <Grid md={1}>
                                        <IconButton
                                            sx={{ color: '#0000008A' }}
                                            aria-label="delete"
                                            onClick={() => handleDeselectCard(row)}
                                            size="large"
                                        >
                                            <DeleteOutline sx={{ color: '#0000008A' }} fontSize="medium" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid mt={1} mx={1} item display={'flex'} flexDirection={'row'} mb={3}>
                                    <Grid item md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 500 }} mb={0.5}>
                                            Qty
                                        </Typography>
                                        <TextField
                                            onChange={(e) => handleChangeCardQty(row, e.target.value)}
                                            type="number"
                                            size={'small'}
                                            value={row.qty === 0 ? '' : row.qty}
                                            InputProps={{
                                                inputProps: { min: 1, max: 100 },
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            className={classes.qtyField}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 500 }} mb={0.5}>
                                            Value <span className={classes.textColorSecondary}>(USD)</span>
                                        </Typography>
                                        <NumberFormatTextField
                                            sx={{ width: '100%' }}
                                            value={row.value}
                                            onChange={(e) => handleChangeCardValue(row, e.target.value)}
                                            name="numberformat"
                                            size="small"
                                            id="formatted-numberformat-input"
                                            variant="outlined"
                                            InputProps={{
                                                error: (row?.value ?? 0) > protectionLimit,
                                                inputProps: { min: 1 },
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider />
                        </div>
                    ))}
            </div>
            {!areSelectedCardsValuesValid() ? (
                <>
                    <Alert severity="error" className={classes.valueAlert}>
                        Card's value can't be higher than the protection level.
                    </Alert>
                </>
            ) : null}
            <div className={classes.paymentContainer}>
                <div className={classes.row}>
                    <Typography className={classes.rowLeftText}>Service Level Fee:</Typography>
                    <Typography className={classes.rowRightBoldText}>
                        <span style={{ fontWeight: 400, color: '#757575' }}>
                            (
                            <NumberFormat
                                value={finalPrice}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'$'}
                            />
                            &nbsp; x {numberOfSelectedCards}) =&nbsp;
                        </span>
                        <NumberFormat
                            value={numberOfSelectedCards * finalPrice}
                            displayType={'text'}
                            thousandSeparator
                            decimalSeparator={'.'}
                            prefix={'$'}
                        />
                    </Typography>
                </div>
                {isCouponApplied ? (
                    <div className={classes.row} style={{ marginTop: '16px' }}>
                        <Typography className={classes.rowLeftText}>Promo Code Discount: </Typography>
                        <NumberFormat
                            value={discountedValue}
                            className={classes.rowRightBoldText}
                            displayType={'text'}
                            thousandSeparator
                            decimalSeparator={'.'}
                            prefix={'-$'}
                        />
                    </div>
                ) : null}
                <div className={classes.row} style={{ marginTop: '16px', marginBottom: '16px' }}>
                    <Typography className={classes.rowLeftText}>
                        {shippingMethod?.code === ShippingMethodType.InsuredShipping
                            ? 'Insured Shipping: '
                            : 'Storage Fee:'}
                    </Typography>
                    <NumberFormat
                        value={shippingMethod?.code === ShippingMethodType.InsuredShipping ? shippingFee : 0}
                        className={classes.rowRightBoldText}
                        displayType={'text'}
                        thousandSeparator
                        decimalSeparator={'.'}
                        prefix={'$'}
                    />
                </div>
                <Divider />
                <div className={classes.row} style={{ marginTop: '16px', marginBottom: '16px' }}>
                    <Typography className={classes.rowLeftText}>Total:</Typography>
                    <Typography className={classes.rowRightBoldText}>
                        &nbsp;
                        <NumberFormat
                            value={getPreviewTotal()}
                            className={classes.rowRightBoldText}
                            displayType={'text'}
                            thousandSeparator
                            decimalSeparator={'.'}
                            prefix={'$'}
                        />
                    </Typography>
                </div>
                <LoadingButton
                    disabled={!isCreateSubmission}
                    onClick={createSubmission}
                    fullWidth
                    loading={isLoading}
                    variant={'contained'}
                    color={'primary'}
                    sx={{ borderRadius: '24px', padding: '10px 20px' }}
                >
                    Create Submission
                </LoadingButton>
            </div>
        </div>
    );
}

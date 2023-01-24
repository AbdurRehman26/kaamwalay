import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { APIService } from '@shared/services/APIService';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import {
    SetCouponInvalidMessage,
    setAppliedCouponData,
    setCouponCode,
    setIsCouponApplied,
    setIsCouponValid,
    setValidCouponId,
    updatePaymentMethodId,
} from '@dashboard/redux/slices/newSubmissionSlice';

const useStyles = makeStyles(
    () => {
        return {
            appliedCouponContainer: {
                width: '100%',
                padding: '8px',
                paddingLeft: '12px',
                paddingRight: '12px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            },
        };
    },
    { name: 'ApplyPromoCode' },
);

export function ApplyPromoCode() {
    const { id } = useParams<'id'>();
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isCouponValid = useAppSelector((state) => state.newSubmission.couponState.isCouponValid);
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const couponCode = useAppSelector((state) => state.newSubmission.couponState.couponCode);
    const couponInvalidMessage = useAppSelector((state) => state.newSubmission.couponState.couponInvalidMessage);
    const discountStatement = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountStatement,
    );
    const validCouponId = useAppSelector((state) => state.newSubmission.couponState.validCouponId);
    const apiService = useInjectable(APIService);
    const originalServiceLevelId = useAppSelector((state) => state.newSubmission.step01Data.originalServiceLevel.id);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const selectedPaymentMethodID = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const selectedCreditCardID = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.id);
    const [showInvalidState, setShowInvalidState] = useState(false);
    const notifications = useNotifications();
    const totalCardItems = (selectedCards || []).reduce((prev: number, cur) => prev + (cur.qty ?? 1), 0);

    const checkCouponCode = useCallback(
        async (newCouponCode: string) => {
            const checkCouponEndpoint = apiService.createEndpoint(
                `customer/coupons/${newCouponCode}?couponables_type=service_level&couponables_id=${originalServiceLevelId}&items_count=${totalCardItems}`,
            );
            try {
                const response = await checkCouponEndpoint.get('');
                dispatch(setIsCouponValid(true));
                dispatch(setValidCouponId(response.data.id));
                if (showInvalidState) {
                    setShowInvalidState(false);
                }
                // When using paypal, and we update the applied coupon code, it won't change the discount for that user.
                // so here, we are resetting the payment method selection
                dispatch(updatePaymentMethodId(1));
            } catch (error: any) {
                dispatch(SetCouponInvalidMessage(error.message));
                dispatch(setIsCouponValid(false));
                dispatch(setValidCouponId(-1));
                setShowInvalidState(true);
            }
        },
        [apiService, dispatch, originalServiceLevelId, showInvalidState, totalCardItems],
    );

    const debounceCheckCoupon = useMemo(
        () => debounce((newCouponCode: string) => checkCouponCode(newCouponCode), 500),
        [checkCouponCode],
    );

    const handleChange = useCallback(
        (e: any) => {
            if (e.target.value.length > 0) {
                dispatch(setCouponCode(e.target.value.toUpperCase()));
                debounceCheckCoupon(e.target.value.toUpperCase());
            }
            dispatch(setCouponCode(e.target.value.toUpperCase()));
        },
        [debounceCheckCoupon, dispatch],
    );

    const handleCouponDismiss = useCallback(async () => {
        if (id) {
            const endpointUrl = `customer/orders/${id}/coupons/remove`;
            const removeCouponEndpoint = apiService.createEndpoint(endpointUrl);
            await removeCouponEndpoint.post('');
            dispatch(setCouponCode(''));
        }

        dispatch(setIsCouponApplied(false));
        dispatch(setIsCouponValid(true));
    }, [apiService, dispatch, id]);

    useEffect(() => {
        handleChange({ target: { value: couponCode } });
    }, [couponCode, handleChange, isCouponValid, showInvalidState]);

    const handleOnBlur = () => {
        if (!isCouponValid) {
            setShowInvalidState(true);
        } else {
            setShowInvalidState(false);
        }
    };

    const handleApplyCoupon = async () => {
        const DTO = {
            paymentPlan: {
                id: originalServiceLevelId,
            },
            items: selectedCards.map((selectedCard: any) => ({
                cardProduct: {
                    id: selectedCard.id,
                },
                quantity: selectedCard.qty,
                declaredValuePerUnit: selectedCard.value,
            })),
            shippingMethod: {
                id: 1,
            },
            paymentMethod: {
                id: selectedPaymentMethodID,
            },
            paymentProviderReference: {
                id: selectedPaymentMethodID === 1 ? selectedCreditCardID : null,
            },
            coupon: {
                code: couponCode,
                id: validCouponId,
            },
            itemsCount: totalCardItems,
        };
        try {
            const endpointUrl = id
                ? `customer/orders/${id}/coupons/calculate-discount`
                : `customer/coupons/calculate-discount`;
            const applyCouponEndpoint = apiService.createEndpoint(endpointUrl);
            const appliedCouponResponse = await applyCouponEndpoint.post('', DTO);
            dispatch(setIsCouponApplied(true));
            dispatch(
                setAppliedCouponData({
                    id: appliedCouponResponse.data.coupon.id,
                    discountStatement: appliedCouponResponse.data.coupon.discountStatement,
                    discountValue: appliedCouponResponse.data.coupon.discountValue,
                    discountedAmount: appliedCouponResponse.data.discountedAmount,
                }),
            );
        } catch (error: any) {
            notifications.exception(error);
        }
    };

    if (isCouponApplied) {
        return (
            <Paper className={classes.appliedCouponContainer} variant={'outlined'}>
                <Box display={'flex'} flexDirection={'column'}>
                    <Typography variant={'subtitle2'} sx={{ fontWeight: 'bold' }}>
                        {couponCode}
                    </Typography>
                    <Typography variant={'caption'} sx={{ marginTop: '3px' }}>
                        {discountStatement}
                    </Typography>
                    <Typography variant={'caption'} color={'red'} sx={{ marginTop: '3px' }}>
                        {!isCouponValid && couponInvalidMessage}
                    </Typography>
                </Box>
                <Box>
                    <IconButton onClick={handleCouponDismiss}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Paper>
        );
    }

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} width={'100%'} marginBottom={'6px'}>
            <Typography variant={'caption'}>Promo Code</Typography>
            <TextField
                error={showInvalidState}
                onChange={handleChange}
                value={couponCode}
                size={'small'}
                fullWidth
                sx={{ width: '100%' }}
                onBlur={handleOnBlur}
                helperText={showInvalidState ? couponInvalidMessage : null}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {showInvalidState ? (
                                <ErrorOutlineIcon />
                            ) : isCouponValid && couponCode !== '' ? (
                                <Button variant="text" onClick={handleApplyCoupon}>
                                    Apply Coupon
                                </Button>
                            ) : null}
                        </InputAdornment>
                    ),
                }}
                placeholder={'Enter Promo Code'}
            />
        </Box>
    );
}

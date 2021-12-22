import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Paper, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import {
    setAppliedCouponData,
    setCouponCode,
    setIsCouponApplied,
    setIsCouponValid,
    setValidCouponId,
} from '@dashboard/redux/slices/newSubmissionSlice';
import InputAdornment from '@mui/material/InputAdornment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNotifications } from '@shared/hooks/useNotifications';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const isCouponValid = useAppSelector((state) => state.newSubmission.couponState.isCouponValid);
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);
    const couponCode = useAppSelector((state) => state.newSubmission.couponState.couponCode);
    const discountStatement = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountStatement,
    );
    const validCouponId = useAppSelector((state) => state.newSubmission.couponState.validCouponId);
    const apiService = useInjectable(APIService);
    const selectedServiceLevelID = useAppSelector((state) => state.newSubmission.step01Data.selectedServiceLevel.id);
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const selectedPaymentMethodID = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const selectedCreditCardID = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.id);
    const [showInvalidState, setShowInvalidState] = useState(false);
    const notifications = useNotifications();
    const checkCouponCode = async (newCouponCode: string) => {
        const checkCouponEndpoint = apiService.createEndpoint(
            `customer/coupons/${newCouponCode}?couponable_type=service_level&couponable_id=${selectedServiceLevelID}`,
        );
        try {
            const response = await checkCouponEndpoint.get('');
            dispatch(setIsCouponValid(true));
            dispatch(setValidCouponId(response.data.id));
            if (showInvalidState) {
                setShowInvalidState(false);
            }
        } catch (error: any) {
            dispatch(setIsCouponValid(false));
            dispatch(setValidCouponId(-1));
        }
    };
    const debounceCheckCoupon = debounce((newCouponCode: string) => checkCouponCode(newCouponCode), 500);

    const handleChange = (e: any) => {
        dispatch(setCouponCode(e.target.value));
        debounceCheckCoupon(e.target.value);
    };

    useEffect(() => {
        handleChange({ target: { value: couponCode } });
    }, [isCouponValid, showInvalidState]);

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
                id: selectedServiceLevelID,
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
        };
        try {
            const applyCouponEndpoint = apiService.createEndpoint(`customer/coupons/calculate-discount`);
            const appliedCouponResponse = await applyCouponEndpoint.post('', DTO);
            dispatch(setIsCouponApplied(true));
            dispatch(
                setAppliedCouponData({
                    id: appliedCouponResponse.data.coupon.id,
                    discountStatement: appliedCouponResponse.data.coupon.discountStatement,
                    discountValue: appliedCouponResponse.data.coupon.discountValue,
                    discountedValue: appliedCouponResponse.data.discountedValue,
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
                </Box>
                <Box>
                    <IconButton onClick={() => dispatch(setIsCouponApplied(false))}>
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
                helperText={showInvalidState ? 'Invalid promo code. Please try again.' : null}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {showInvalidState ? (
                                <ErrorOutlineIcon />
                            ) : isCouponValid ? (
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

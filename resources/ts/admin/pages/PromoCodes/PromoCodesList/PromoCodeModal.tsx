import * as React from 'react';
import { useCallback, useMemo } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import { Paper, TextField } from '@mui/material';
import {
    clearNewPromoCodeState,
    setCouponablesForApplicables,
    setDescription,
    setDiscountApplicationType,
    setDiscountDateType,
    setDiscountEndDate,
    setDiscountStartDate,
    setDiscountType,
    setDiscountValue,
    setPromoCodeTextValue,
    setShowNewPromoCodeDialog,
    toggleSelectedServiceLevel,
} from '@shared/redux/slices/adminNewPromoCodeSlice';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import Radio from '@mui/material/Radio';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { DiscountTypeEnums } from '@shared/constants/DiscountTypeEnums';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';
import { ServiceLevelApplicableItemEntity } from '@shared/entities/ServiceLevelApplicableItemEntity';
import { storeCoupon } from '@shared/redux/slices/adminPromoCodesSlice';
import moment from 'moment/moment';

const useStyles = makeStyles(
    () => {
        return {
            inputWithLabelContainer: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minWidth: '100%',
            },
            label: {
                fontWeight: 'bold',
                fontSize: '16px',
            },
            secondaryLabel: {
                fontSize: '14px',
            },
            discountOption: {
                padding: '6px',
                minWidth: '49.5%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            },
        };
    },
    { name: 'PromoCodeModal' },
);

export function PromoCodeModal() {
    const classes = useStyles();
    const dispatch = useSharedDispatch();
    const modalTitle = useSharedSelector((state) => state.adminNewPromoCodeSlice.modalTitle);
    const promoCodeValue = useSharedSelector((state) => state.adminNewPromoCodeSlice.promoCode);
    const discountType = useSharedSelector((state) => state.adminNewPromoCodeSlice.type);
    const discountValue = useSharedSelector((state) => state.adminNewPromoCodeSlice.discountValue);
    const discountApplicationType = useSharedSelector((state) => state.adminNewPromoCodeSlice.discountApplicationType);
    const isPermanent = useSharedSelector((state) => state.adminNewPromoCodeSlice.isPermanent);
    const discountStartDate = useSharedSelector((state) => state.adminNewPromoCodeSlice.availableFrom);
    const discountEndDate = useSharedSelector((state) => state.adminNewPromoCodeSlice.availableTill);
    const showModal = useSharedSelector((state) => state.adminNewPromoCodeSlice.showNewPromoCodeDialog);
    const applicables = useSharedSelector((state) => state.adminNewPromoCodeSlice.applicables);
    const description = useSharedSelector((state) => state.adminNewPromoCodeSlice.description);

    const serviceLevelApplicableIndex = useMemo(
        () => applicables!.findIndex((applicableItem) => applicableItem.code === 'service_level'),
        [applicables],
    );

    const serviceLevelCouponables = useSharedSelector(
        // @ts-ignore
        (state) => state.adminNewPromoCodeSlice.applicables[serviceLevelApplicableIndex]?.couponables,
    );
    const apiService = useInjectable(APIService);

    const handleCloseModal = useCallback(() => {
        dispatch(setShowNewPromoCodeDialog(false));
        dispatch(clearNewPromoCodeState());
    }, [showModal]);

    const selectedDiscountApplicationServiceLevels = useSharedSelector(
        (state) => state.adminNewPromoCodeSlice.selectedDiscountApplicationServiceLevelsIds,
    );

    const handleDescriptionChange = useCallback(
        (event: any) => {
            dispatch(setDescription(event.target.value));
        },
        [description],
    );

    const handlePromoCodeChange = useCallback(
        (event: any) => {
            dispatch(setPromoCodeTextValue(event.target.value.toUpperCase()));
        },
        [promoCodeValue],
    );

    const handleDiscountValueChange = useCallback(
        (event: any) => {
            dispatch(setDiscountValue(event.target.value));
        },
        [discountValue],
    );

    const handleDiscountTypeRadioPress = useCallback(
        (newDiscountType: DiscountTypeEnums) => {
            return () => {
                if (newDiscountType !== discountType) {
                    dispatch(setDiscountValue(''));
                }
                dispatch(setDiscountType(newDiscountType));
            };
        },
        [discountType],
    );

    const handleDiscountApplicationTypeRadioPress = useCallback(
        (applicableId: number, applicableCode) => {
            return async () => {
                if (applicableCode === 'service_level') {
                    const couponablesEndpoint = apiService.createEndpoint(
                        `admin/couponable/entities?coupon_applicable_id=${applicableId}`,
                    );
                    const couponables = await couponablesEndpoint.get('');
                    const mappedCouponables: ServiceLevelApplicableItemEntity[] = couponables.data.map((item: any) => {
                        return {
                            id: item.id,
                            label: item.price,
                        };
                    });
                    dispatch(setCouponablesForApplicables({ applicableCode, couponables: mappedCouponables }));
                }
                dispatch(setDiscountApplicationType(applicableCode));
            };
        },
        [discountApplicationType],
    );

    const handleDiscountDateTypeRadioPress = useCallback(
        (incomingDateType: boolean) => {
            return () => {
                dispatch(setDiscountDateType(incomingDateType));
            };
        },
        [isPermanent],
    );

    const onServiceLevelPress = (serviceLevelId: number) => {
        return () => {
            dispatch(toggleSelectedServiceLevel(serviceLevelId));
        };
    };

    const handleDiscountStartDateChange = useCallback(
        (date: any) => {
            dispatch(setDiscountStartDate(date));
        },
        [discountStartDate],
    );

    const handleDiscountEndDateChange = useCallback(
        (date: any) => {
            dispatch(setDiscountEndDate(date));
        },
        [discountEndDate],
    );

    const isSaveButtonDisabled = () => {
        const validationErrors = [];
        if (!promoCodeValue) {
            validationErrors.push('Promo code is required');
        }
        if (!description) {
            validationErrors.push('Description is required');
        }
        if (!discountValue) {
            validationErrors.push('Discount value is required');
        }
        if (discountApplicationType === 'service_level' && selectedDiscountApplicationServiceLevels.length === 1) {
            validationErrors.push('At least one service level must be selected');
        }
        if (!isPermanent && !discountStartDate) {
            validationErrors.push('Start date is required');
        }
        if (!isPermanent && !discountEndDate) {
            validationErrors.push('End date is required');
        }
        return !!validationErrors.length;
    };

    const handleStorePromoCode = async () => {
        dispatch(
            storeCoupon({
                code: promoCodeValue!,
                type: discountType!,
                couponApplicableId:
                    applicables?.filter((applicable) => applicable?.code === discountApplicationType)[0].id ?? 0,
                availableFrom: !isPermanent ? moment(discountStartDate!).format('YYYY-MM-DD') : null,
                availableTill: !isPermanent ? moment(discountEndDate!).format('YYYY-MM-DD') : null,
                isPermanent: isPermanent!,
                couponables: selectedDiscountApplicationServiceLevels.filter((serviceLevel) => serviceLevel !== -2)!,
                discountValue: discountValue!,
                description: description,
            }),
        );
    };

    function getMinDateProp() {
        if (discountStartDate) {
            return {
                minDate: discountStartDate,
            };
        } else {
            return {};
        }
    }

    function getMaxDateProp() {
        if (discountEndDate) {
            return {
                maxDate: discountEndDate,
            };
        } else {
            return {};
        }
    }

    return (
        <Dialog onClose={handleCloseModal} open={showModal} maxWidth={'sm'} fullWidth>
            <DialogTitle>
                {modalTitle}
                <IconButton
                    onClick={handleCloseModal}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box className={classes.inputWithLabelContainer}>
                    <Typography variant={'subtitle1'} className={classes.label}>
                        Promo Code
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder={'Enter Promo Code'}
                        size={'small'}
                        variant="outlined"
                        value={promoCodeValue}
                        onChange={handlePromoCodeChange}
                    />
                </Box>
                <Box className={classes.inputWithLabelContainer} sx={{ marginTop: '32px' }}>
                    <Typography variant={'subtitle1'} className={classes.label}>
                        Description
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder={'Enter a description'}
                        size={'small'}
                        variant="outlined"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </Box>
                <Box className={classes.inputWithLabelContainer} marginTop={'32px'}>
                    <Typography variant={'subtitle1'} className={classes.label}>
                        Discount
                    </Typography>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} sx={{ width: '100%' }}>
                        <Paper
                            variant={'outlined'}
                            className={classes.discountOption}
                            onClick={handleDiscountTypeRadioPress(DiscountTypeEnums.percentage)}
                        >
                            <Radio
                                checked={discountType === DiscountTypeEnums.percentage}
                                onChange={handleDiscountTypeRadioPress(DiscountTypeEnums.percentage)}
                                value={DiscountTypeEnums.percentage}
                            />
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                <Typography
                                    variant={'caption'}
                                    className={classes.secondaryLabel}
                                    sx={{
                                        fontWeight: discountType === DiscountTypeEnums.percentage ? 'bold' : 'normal',
                                    }}
                                >
                                    Percent Off
                                </Typography>
                                {discountType === DiscountTypeEnums.percentage ? (
                                    <TextField
                                        placeholder={'0.00'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        size={'small'}
                                        sx={{ maxWidth: '120px', marginLeft: '3px' }}
                                        variant="outlined"
                                        value={discountValue}
                                        onChange={handleDiscountValueChange}
                                    />
                                ) : null}
                            </Box>
                        </Paper>
                        <Paper
                            variant={'outlined'}
                            className={classes.discountOption}
                            onClick={handleDiscountTypeRadioPress(DiscountTypeEnums.fixed)}
                        >
                            <Radio
                                checked={discountType === DiscountTypeEnums.fixed}
                                onChange={handleDiscountTypeRadioPress(DiscountTypeEnums.fixed)}
                                value={DiscountTypeEnums.fixed}
                            />
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                <Typography
                                    variant={'caption'}
                                    className={classes.secondaryLabel}
                                    sx={{
                                        fontWeight: discountType === DiscountTypeEnums.fixed ? 'bold' : 'normal',
                                    }}
                                >
                                    Flat Discount
                                </Typography>
                                {discountType === DiscountTypeEnums.fixed ? (
                                    <TextField
                                        placeholder={'0.00'}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        size={'small'}
                                        sx={{ maxWidth: '120px', marginLeft: '3px' }}
                                        variant="outlined"
                                        value={discountValue}
                                        onChange={handleDiscountValueChange}
                                    />
                                ) : null}
                            </Box>
                        </Paper>
                    </Box>
                    <Box className={classes.inputWithLabelContainer} marginTop={'32px'}>
                        <Typography variant={'subtitle1'} className={classes.label}>
                            Applies To
                        </Typography>
                        <Box display={'flex'} flexDirection={'column'} minWidth={'100%'}>
                            {applicables?.map((item) => {
                                return (
                                    <Paper variant={'outlined'} key={item.id} sx={{ width: '100%', padding: '8px' }}>
                                        <Radio
                                            checked={discountApplicationType === item.code}
                                            onChange={handleDiscountApplicationTypeRadioPress(item.id, item.code)}
                                            value={item.code}
                                        />
                                        <Typography
                                            variant={'caption'}
                                            className={classes.secondaryLabel}
                                            sx={{
                                                fontWeight: discountApplicationType === item.code ? 'bold' : 'normal',
                                            }}
                                        >
                                            {item.label}
                                        </Typography>

                                        {/* // @ts-ignore*/}
                                        {discountApplicationType === 'service_level' &&
                                        item.code === 'service_level' ? (
                                            <Box
                                                display={'flex'}
                                                flexDirection={'column'}
                                                flexWrap={'wrap'}
                                                justifyContent={'space-around'}
                                                maxWidth={'176px'}
                                                maxHeight={'250px'}
                                            >
                                                {serviceLevelCouponables?.map((item2: any) => {
                                                    return (
                                                        <Box
                                                            display={'flex'}
                                                            flexDirection={'row'}
                                                            alignItems={'center'}
                                                            width={'120px'}
                                                        >
                                                            <Checkbox
                                                                checked={selectedDiscountApplicationServiceLevels?.includes(
                                                                    item2.id,
                                                                )}
                                                                onChange={onServiceLevelPress(item2.id)}
                                                            />
                                                            <Typography sx={{ marginLeft: '3px' }} variant={'caption'}>
                                                                ${item2.label}
                                                            </Typography>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        ) : null}
                                    </Paper>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>

                <Box className={classes.inputWithLabelContainer} marginTop={'32px'}>
                    <Typography variant={'subtitle1'} className={classes.label}>
                        Date
                    </Typography>
                    <Box display={'flex'} flexDirection={'column'} minWidth={'100%'}>
                        <Paper variant={'outlined'} sx={{ width: '100%', padding: '8px' }}>
                            <Radio
                                checked={isPermanent}
                                onChange={handleDiscountDateTypeRadioPress(true)}
                                value={true}
                            />
                            <Typography
                                variant={'caption'}
                                className={classes.secondaryLabel}
                                sx={{
                                    fontWeight: isPermanent ? 'bold' : 'normal',
                                }}
                            >
                                Permanent
                            </Typography>
                        </Paper>

                        <Paper variant={'outlined'} sx={{ width: '100%', padding: '8px', marginTop: '8px' }}>
                            <Radio
                                checked={!isPermanent}
                                onChange={handleDiscountDateTypeRadioPress(false)}
                                value={false}
                            />
                            <Typography
                                variant={'caption'}
                                className={classes.secondaryLabel}
                                sx={{
                                    fontWeight: !isPermanent ? 'bold' : 'normal',
                                }}
                            >
                                Date Range
                            </Typography>
                            {!isPermanent ? (
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-around'}
                                    alignItems={'center'}
                                    marginTop={'12px'}
                                >
                                    <LocalizationProvider dateAdapter={DateAdapter}>
                                        <DateTimePicker
                                            label="Start Date"
                                            value={discountStartDate}
                                            onChange={handleDiscountStartDateChange}
                                            renderInput={(params) => <TextField {...params} />}
                                            {...getMaxDateProp()}
                                        />
                                        <Typography variant={'caption'}>{' to '}</Typography>
                                        <DateTimePicker
                                            label="End Date"
                                            value={discountEndDate}
                                            onChange={handleDiscountEndDateChange}
                                            renderInput={(params) => <TextField {...params} />}
                                            {...getMinDateProp()}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            ) : null}
                        </Paper>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button variant={'contained'} disabled={isSaveButtonDisabled()} onClick={handleStorePromoCode}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

import * as React from 'react';
import { useCallback } from 'react';
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
    setDiscountApplicationType,
    setDiscountDateType,
    setDiscountEndDate,
    setDiscountStartDate,
    setDiscountType,
    setFlatDiscountValue,
    setPercentOffValue,
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
import { DiscountApplicationEnums } from '@shared/constants/DiscountApplicationEnum';
import { DiscountDateTypeEnum } from '@shared/constants/DiscountDateTypeEnum';
import { DiscountTypeEnums } from '@shared/constants/DiscountTypeEnums';

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
    const discountType = useSharedSelector((state) => state.adminNewPromoCodeSlice.discountType);
    const flatDiscountValue = useSharedSelector((state) => state.adminNewPromoCodeSlice.flatDiscountValue);
    const percentOffValue = useSharedSelector((state) => state.adminNewPromoCodeSlice.percentOffValue);
    const discountApplicationType = useSharedSelector((state) => state.adminNewPromoCodeSlice.discountApplicationType);
    const discountDateType = useSharedSelector((state) => state.adminNewPromoCodeSlice.discountDateType);
    const discountStartDate = useSharedSelector((state) => state.adminNewPromoCodeSlice.discountStartDate);
    const discountEndDate = useSharedSelector((state) => state.adminNewPromoCodeSlice.discountEndDate);
    const showModal = useSharedSelector((state) => state.adminNewPromoCodeSlice.showNewPromoCodeDialog);

    const handleCloseModal = useCallback(() => {
        dispatch(setShowNewPromoCodeDialog(false));
        dispatch(clearNewPromoCodeState());
    }, [showModal]);

    const availableServiceLevels = useSharedSelector(
        (state) => state.adminNewPromoCodeSlice.availableApplicationServiceLevels,
    );
    const selectedDiscountApplicationServiceLevels = useSharedSelector(
        (state) => state.adminNewPromoCodeSlice.selectedDiscountApplicationServiceLevelsIds,
    );

    const handlePromoCodeChange = useCallback(
        (event: any) => {
            dispatch(setPromoCodeTextValue(event.target.value));
        },
        [promoCodeValue],
    );

    const handlePercentOffChange = useCallback(
        (event: any) => {
            dispatch(setPercentOffValue(event.target.value));
        },
        [percentOffValue],
    );

    const handleFlatDiscountValueChange = useCallback(
        (event: any) => {
            dispatch(setFlatDiscountValue(event.target.value));
        },
        [flatDiscountValue],
    );

    const handleDiscountTypeRadioPress = useCallback(
        (newDiscountType: DiscountTypeEnums) => {
            return () => {
                dispatch(setDiscountType(newDiscountType));
            };
        },
        [discountType],
    );

    const handleDiscountApplicationTypeRadioPress = useCallback(
        (newDiscountApplicationType: DiscountApplicationEnums) => {
            return () => {
                dispatch(setDiscountApplicationType(newDiscountApplicationType));
            };
        },
        [discountApplicationType],
    );

    const handleDiscountDateTypeRadioPress = useCallback(
        (newDiscountDateType: DiscountDateTypeEnum) => {
            return () => {
                dispatch(setDiscountDateType(newDiscountDateType));
            };
        },
        [discountDateType],
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
        if (discountType === DiscountTypeEnums.flatDiscount && !flatDiscountValue) {
            validationErrors.push('Flat discount value is required');
        }
        if (discountType === DiscountTypeEnums.percentOff && !percentOffValue) {
            validationErrors.push('Percent Off value is required');
        }
        if (
            discountApplicationType === DiscountApplicationEnums.selectServiceLevels &&
            !selectedDiscountApplicationServiceLevels.length
        ) {
            validationErrors.push('At least one service level must be selected');
        }
        if (discountDateType === DiscountDateTypeEnum.dateRange && !discountStartDate) {
            validationErrors.push('Start date is required');
        }
        if (discountDateType === DiscountDateTypeEnum.dateRange && !discountEndDate) {
            validationErrors.push('End date is required');
        }
        return !!validationErrors.length;
    };
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
                <Box className={classes.inputWithLabelContainer} marginTop={'32px'}>
                    <Typography variant={'subtitle1'} className={classes.label}>
                        Discount
                    </Typography>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} sx={{ width: '100%' }}>
                        <Paper
                            variant={'outlined'}
                            className={classes.discountOption}
                            onClick={handleDiscountTypeRadioPress(DiscountTypeEnums.percentOff)}
                        >
                            <Radio
                                checked={discountType === DiscountTypeEnums.percentOff}
                                onChange={handleDiscountTypeRadioPress(DiscountTypeEnums.percentOff)}
                                value={DiscountTypeEnums.percentOff}
                            />
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                <Typography
                                    variant={'caption'}
                                    className={classes.secondaryLabel}
                                    sx={{
                                        fontWeight: discountType === DiscountTypeEnums.percentOff ? 'bold' : 'normal',
                                    }}
                                >
                                    Percent Off
                                </Typography>
                                {discountType === DiscountTypeEnums.percentOff ? (
                                    <TextField
                                        placeholder={'0.00'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        size={'small'}
                                        sx={{ maxWidth: '120px', marginLeft: '3px' }}
                                        variant="outlined"
                                        value={percentOffValue}
                                        onChange={handlePercentOffChange}
                                    />
                                ) : null}
                            </Box>
                        </Paper>
                        <Paper
                            variant={'outlined'}
                            className={classes.discountOption}
                            onClick={handleDiscountTypeRadioPress(DiscountTypeEnums.flatDiscount)}
                        >
                            <Radio
                                checked={discountType === DiscountTypeEnums.flatDiscount}
                                onChange={handleDiscountTypeRadioPress(DiscountTypeEnums.flatDiscount)}
                                value={DiscountTypeEnums.flatDiscount}
                            />
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                <Typography
                                    variant={'caption'}
                                    className={classes.secondaryLabel}
                                    sx={{
                                        fontWeight: discountType === DiscountTypeEnums.flatDiscount ? 'bold' : 'normal',
                                    }}
                                >
                                    Flat Discount
                                </Typography>
                                {discountType === DiscountTypeEnums.flatDiscount ? (
                                    <TextField
                                        placeholder={'0.00'}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        size={'small'}
                                        sx={{ maxWidth: '120px', marginLeft: '3px' }}
                                        variant="outlined"
                                        value={flatDiscountValue}
                                        onChange={handleFlatDiscountValueChange}
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
                            <Paper variant={'outlined'} sx={{ width: '100%', padding: '8px' }}>
                                <Radio
                                    checked={discountApplicationType === DiscountApplicationEnums.totalServiceFee}
                                    onChange={handleDiscountApplicationTypeRadioPress(
                                        DiscountApplicationEnums.totalServiceFee,
                                    )}
                                    value={DiscountApplicationEnums.totalServiceFee}
                                />
                                <Typography
                                    variant={'caption'}
                                    className={classes.secondaryLabel}
                                    sx={{
                                        fontWeight:
                                            discountApplicationType === DiscountApplicationEnums.totalServiceFee
                                                ? 'bold'
                                                : 'normal',
                                    }}
                                >
                                    Total Service Fee
                                </Typography>
                            </Paper>

                            <Paper variant={'outlined'} sx={{ width: '100%', padding: '8px', marginTop: '8px' }}>
                                <Radio
                                    checked={discountApplicationType === DiscountApplicationEnums.selectServiceLevels}
                                    onChange={handleDiscountApplicationTypeRadioPress(
                                        DiscountApplicationEnums.selectServiceLevels,
                                    )}
                                    value={DiscountApplicationEnums.selectServiceLevels}
                                />
                                <Typography
                                    variant={'caption'}
                                    className={classes.secondaryLabel}
                                    sx={{
                                        fontWeight:
                                            discountApplicationType === DiscountApplicationEnums.selectServiceLevels
                                                ? 'bold'
                                                : 'normal',
                                    }}
                                >
                                    Select Service Levels
                                </Typography>

                                {discountApplicationType === DiscountApplicationEnums.selectServiceLevels ? (
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        flexWrap={'wrap'}
                                        justifyContent={'space-around'}
                                        maxWidth={'176px'}
                                    >
                                        {availableServiceLevels?.map((item) => {
                                            return (
                                                <Box
                                                    display={'flex'}
                                                    flexDirection={'row'}
                                                    alignItems={'center'}
                                                    width={'69px'}
                                                >
                                                    <Checkbox
                                                        checked={selectedDiscountApplicationServiceLevels?.includes(
                                                            item.id,
                                                        )}
                                                        onChange={onServiceLevelPress(item.id)}
                                                    />
                                                    <Typography sx={{ marginLeft: '3px' }} variant={'caption'}>
                                                        ${item.value}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                ) : null}
                            </Paper>
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
                                checked={discountDateType === DiscountDateTypeEnum.permanent}
                                onChange={handleDiscountDateTypeRadioPress(DiscountDateTypeEnum.permanent)}
                                value={DiscountDateTypeEnum.permanent}
                            />
                            <Typography
                                variant={'caption'}
                                className={classes.secondaryLabel}
                                sx={{
                                    fontWeight: discountDateType === DiscountDateTypeEnum.permanent ? 'bold' : 'normal',
                                }}
                            >
                                Permanent
                            </Typography>
                        </Paper>

                        <Paper variant={'outlined'} sx={{ width: '100%', padding: '8px', marginTop: '8px' }}>
                            <Radio
                                checked={discountDateType === DiscountDateTypeEnum.dateRange}
                                onChange={handleDiscountDateTypeRadioPress(DiscountDateTypeEnum.dateRange)}
                                value={DiscountDateTypeEnum.dateRange}
                            />
                            <Typography
                                variant={'caption'}
                                className={classes.secondaryLabel}
                                sx={{
                                    fontWeight: discountDateType === DiscountDateTypeEnum.dateRange ? 'bold' : 'normal',
                                }}
                            >
                                Date Range
                            </Typography>
                            {discountDateType === DiscountDateTypeEnum.dateRange ? (
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
                                        />
                                        <Typography variant={'caption'}>{' to '}</Typography>
                                        <DateTimePicker
                                            label="End Date"
                                            value={discountEndDate}
                                            onChange={handleDiscountEndDateChange}
                                            renderInput={(params) => <TextField {...params} />}
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
                <Button variant={'contained'} disabled={isSaveButtonDisabled()} onClick={() => ''}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

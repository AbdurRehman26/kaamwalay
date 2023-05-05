import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import ReactGA from 'react-ga4';
import NumberFormat from 'react-number-format';
import { EventCategories, ServiceLevelEvents } from '@shared/constants/GAEventsTypes';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { SubmissionService, setServiceLevel } from '../redux/slices/newSubmissionSlice';
import { QuantityDependentPricing } from './QuantityDependentPricing';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px',
            border: '2px solid #DDDDDD',
            marginBottom: ({ currentSelectedLevelId, id }: any) => (currentSelectedLevelId === id ? '0px' : '12px'),
            borderTopLeftRadius: '2px',
            borderTopRightRadius: '2px',
            padding: '10px 8px 10px 6px',
            '&:hover': {
                cursor: 'pointer',
            },
            background: ({ currentSelectedLevelId, id }: any) =>
                currentSelectedLevelId === id ? '#20BFB8' : '#FFFFFF',
            borderColor: ({ currentSelectedLevelId, id }: any) =>
                currentSelectedLevelId === id ? '#20BFB8' : '#DDDDDD',
            borderWidth: ({ currentSelectedLevelId, id }: any) => (currentSelectedLevelId === id ? '2px' : '1px'),
        },
        leftSide: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '30%',
            marginLeft: '10px',
        },
        rightSide: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            [theme.breakpoints.down('sm')]: {
                minWidth: '8rem',
            },
        },
        maxValueContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            maxHeight: '64px',
            padding: 0,
        },
        levelTitle: {
            fontFamily: 'Roboto',
            transform: 'translateZ(0)',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.2px',
            color: ({ currentSelectedLevelId, id }: any) =>
                currentSelectedLevelId === id ? '#fff' : 'rgba(0, 0, 0, 0.87)',
            [theme.breakpoints.down('sm')]: {
                fontSize: '14px',
            },
        },
        protectionText: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'right',
            letterSpacing: '0.2px',
            color: ({ currentSelectedLevelId, id }: any) =>
                currentSelectedLevelId === id ? '#fff' : 'rgba(0, 0, 0, 0.87)',
        },
        price: {
            fontFamily: 'Roboto',
            transform: 'translateZ(0)',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        turnaround: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            textAlign: 'right',
            letterSpacing: '0.2px',
            color: ({ currentSelectedLevelId, id }: any) =>
                currentSelectedLevelId === id ? '#fff' : 'rgba(0, 0, 0, 0.87)',
        },
        priceBeforeDiscount: {
            textDecorationLine: 'line-through',
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: '13px',
            marginBottom: '3px',
        },
        discountPercentage: {
            fontWeight: 'bold',
            fontSize: '13px',
            color: '#20BFB8',
        },
        protectionTextContainer: {
            display: 'flex',
            flexDirection: 'row',
        },
        cardText: { fontWeight: 400 },
        quantity: {
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.2px',
            color: ({ currentSelectedLevelId, id }: any) =>
                currentSelectedLevelId === id ? '#fff' : 'rgba(0, 0, 0, 0.87)',
        },
    }),
    { name: 'ServiceLevelItemStyle' },
);

function ServiceLevelItem(props: SubmissionService & { key: any }) {
    const currentSelectedLevel = useAppSelector((state) => state.newSubmission.step01Data.selectedServiceLevel);
    const classes = useStyles({ id: props.id, currentSelectedLevelId: currentSelectedLevel?.id });
    const dispatch = useAppDispatch();
    const {
        id,
        price,
        turnaround,
        type,
        maxProtectionAmount,
        priceBeforeDiscount,
        discountPercentage,
        priceRanges,
        minPrice,
        maxPrice,
    } = props;

    const handleSetServiceLevel = useCallback(() => {
        dispatch(
            setServiceLevel({ id, price, turnaround, type, maxProtectionAmount, priceRanges, minPrice, maxPrice }),
        );
        ReactGA.gtag('event', {
            category: EventCategories.ServiceLevels,
            action: ServiceLevelEvents.pressed,
            dimension1: 'Level',
            metric1: id,
        });
    }, [dispatch, id, maxProtectionAmount, price, turnaround, type, priceRanges, minPrice, maxPrice]);

    function getMaxProtectionAmount() {
        return maxProtectionAmount >= 1000000
            ? Intl.NumberFormat('en-GB', { notation: 'compact', compactDisplay: 'short' }).format(maxProtectionAmount)
            : maxProtectionAmount;
    }

    return (
        <>
            <ButtonBase onClick={handleSetServiceLevel} className={classes.root}>
                <div className={classes.leftSide}>
                    <div className={classes.rightSide}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
                            {priceBeforeDiscount ? (
                                <NumberFormat
                                    value={priceBeforeDiscount}
                                    displayType={'text'}
                                    thousandSeparator
                                    decimalSeparator={'.'}
                                    prefix={'$'}
                                    className={classes.priceBeforeDiscount}
                                />
                            ) : null}
                            {priceRanges ? (
                                <Typography variant={'subtitle2'} className={classes.levelTitle}>
                                    <NumberFormat
                                        value={minPrice}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                    />
                                    &nbsp;
                                    <span>-</span>
                                    &nbsp;
                                    <NumberFormat
                                        value={maxPrice}
                                        displayType={'text'}
                                        thousandSeparator
                                        decimalSeparator={'.'}
                                        prefix={'$'}
                                    />
                                    &nbsp;<span className={classes.cardText}> / Card </span>
                                </Typography>
                            ) : null}
                            <Typography className={classes.quantity}>Depending on qty.</Typography>
                            {priceBeforeDiscount ? (
                                <Typography className={classes.discountPercentage}>{discountPercentage}</Typography>
                            ) : null}
                        </Box>
                    </div>
                </div>

                <div className={classes.maxValueContainer}>
                    <div className={classes.protectionTextContainer}>
                        <Typography className={classes.protectionText}>
                            Protection up to&nbsp;
                            <span>
                                <NumberFormat
                                    value={getMaxProtectionAmount()}
                                    isNumericString
                                    displayType={'text'}
                                    thousandSeparator
                                    decimalSeparator={'.'}
                                    prefix={'$'}
                                    className={classes.protectionText}
                                />
                            </span>
                        </Typography>
                    </div>
                    <Typography
                        variant={'subtitle2'}
                        className={classes.turnaround}
                    >{`${turnaround} Turnaround`}</Typography>
                </div>
            </ButtonBase>
            {currentSelectedLevel?.id === id ? <QuantityDependentPricing priceRanges={priceRanges} /> : null}
        </>
    );
}

export default ServiceLevelItem;

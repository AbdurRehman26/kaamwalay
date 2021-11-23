import ButtonBase from '@mui/material/ButtonBase';
import Radio, { RadioProps } from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import React, { useCallback } from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { EventCategories, ServiceLevelEvents } from '@shared/constants/GAEventsTypes';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setServiceLevel, SubmissionService } from '../redux/slices/newSubmissionSlice';
import Box from '@mui/material/Box';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxHeight: '80px',
            border: '2px solid #DDDDDD',
            marginBottom: '12px',
            borderRadius: '2px',
            padding: '10px 8px 10px 6px',
            '&:hover': {
                cursor: 'pointer',
            },
            borderColor: ({ currentSelectedLevelId, id }: any) =>
                currentSelectedLevelId === id ? '#20BFB8' : '#DDDDDD',
            borderWidth: ({ currentSelectedLevelId, id }: any) => (currentSelectedLevelId?.id === id ? '2px' : '1px'),
        },
        leftSide: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '30%',
        },
        rightSide: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            [theme.breakpoints.down('sm')]: {
                minWidth: '106px',
            },
        },
        radioBtnContainer: {},
        maxValueContainer: {
            display: 'flex',
            flexDirection: 'column',
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
            color: 'rgba(0, 0, 0, 0.87)',
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
            color: 'rgba(0, 0, 0, 0.54)',
        },
        priceBeforeDiscount: {
            textDecorationLine: 'line-through',
            color: 'rgba(0, 0, 0, 0.54)',
            fontSize: '13px',
            marginBottom: '3px',
        },
        discountPercentage: {
            fontWeight: 'bold',
            color: '#20BFB8',
        },
        protectionTextContainer: {
            display: 'flex',
            flexDirection: 'row',
        },
        cardText: { fontWeight: 400 },
    }),
    { name: 'ServiceLevelItemStyle' },
);

const GreenRadio = withStyles({
    root: {
        '&$checked': {
            color: '#20BFB8',
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

function ServiceLevelItem(props: SubmissionService & { key: any }) {
    const currentSelectedLevel = useAppSelector((state) => state.newSubmission.step01Data.selectedServiceLevel);
    const classes = useStyles({ id: props.id, currentSelectedLevelId: currentSelectedLevel?.id });
    const dispatch = useAppDispatch();
    const { id, price, turnaround, type, maxProtectionAmount, priceBeforeDiscount, discountPercentage } = props;

    const handleSetServiceLevel = useCallback(() => {
        dispatch(setServiceLevel({ id, price, turnaround, type, maxProtectionAmount }));
        ReactGA.event({
            category: EventCategories.ServiceLevels,
            action: ServiceLevelEvents.pressed,
            dimension1: 'Level',
            metric1: id,
        });
    }, [dispatch, id, maxProtectionAmount, price, turnaround, type]);

    return (
        <ButtonBase onClick={handleSetServiceLevel} className={classes.root}>
            <div className={classes.leftSide}>
                <div className={classes.radioBtnContainer}>
                    <GreenRadio checked={currentSelectedLevel?.id === id} />
                </div>
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
                        <Typography variant={'subtitle2'} className={classes.levelTitle}>
                            <NumberFormat
                                value={price}
                                displayType={'text'}
                                thousandSeparator
                                decimalSeparator={'.'}
                                prefix={'$'}
                            />
                            &nbsp;<span className={classes.cardText}> / Card </span>
                        </Typography>
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
                                value={maxProtectionAmount}
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
    );
}

export default ServiceLevelItem;

import ButtonBase from '@material-ui/core/ButtonBase';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { EventCategories, ServiceLevelEvents } from '@shared/components/GoogleAnalyticsWrapper/GAEventsTypes';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setServiceLevel, SubmissionService } from '../redux/slices/newSubmissionSlice';

const useStyles = makeStyles(
    {
        root: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxHeight: '64px',
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
        protectionTextContainer: {
            display: 'flex',
            flexDirection: 'row',
        },
        cardText: { fontWeight: 400 },
    },
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
    const { id, price, turnaround, type, maxProtectionAmount } = props;

    const handleSetServiceLevel = useCallback(() => {
        dispatch(setServiceLevel({ id, price, turnaround, type, maxProtectionAmount }));
        ReactGA.event({ category: EventCategories.ServiceLevels, action: ServiceLevelEvents.pressed, value: id });
    }, [dispatch, id, maxProtectionAmount, price, turnaround, type]);

    return (
        <ButtonBase onClick={handleSetServiceLevel} className={classes.root}>
            <div className={classes.leftSide}>
                <div className={classes.radioBtnContainer}>
                    <GreenRadio checked={currentSelectedLevel?.id === id} />
                </div>
                <div className={classes.rightSide}>
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

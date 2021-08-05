import Radio, { RadioProps } from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { HTMLAttributes } from 'react';

import { ReactComponent as ColoredCC } from '@shared/assets/coloredCC.svg';
import { ReactComponent as PaypalLogo } from '@shared/assets/paypalLogo.svg';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setServiceLevel, SubmissionService } from '../redux/slices/newSubmissionSlice';

const useStyles = makeStyles(
    {
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '48%',
            maxHeight: '56px',
            border: '2px solid #DDDDDD',
            marginBottom: '12px',
            borderRadius: '2px',
            padding: '10px 8px 10px 6px',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        leftSide: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '100%',
        },
        rightSide: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        radioBtnContainer: {
            display: 'flex',
            flexDirection: 'row',
        },
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
            marginLeft: '12px',
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

type PaymentMethodItemProps = {
    isSelected: boolean;
    methodName: string;
};

function PaymentMethodItem(props: PaymentMethodItemProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { isSelected, methodName } = props;
    return (
        <div
            className={classes.root}
            style={{
                borderColor: isSelected ? '#20BFB8' : '#DDDDDD',
                borderWidth: isSelected ? '2px' : '1px',
            }}
        >
            <div className={classes.leftSide}>
                <div className={classes.radioBtnContainer}>
                    <GreenRadio checked={isSelected} />
                </div>
                {methodName === 'Credit or Debit Card' ? <ColoredCC /> : <PaypalLogo />}

                {methodName === 'Credit or Debit Card' ? (
                    <div className={classes.rightSide}>
                        <Typography
                            variant={'subtitle2'}
                            className={classes.levelTitle}
                            style={{ fontWeight: isSelected ? 'bold' : 'normal' }}
                        >
                            {methodName}
                        </Typography>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default PaymentMethodItem;

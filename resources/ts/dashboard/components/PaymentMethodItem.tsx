import ButtonBase from '@material-ui/core/ButtonBase';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';

import { ReactComponent as ColoredCC } from '@shared/assets/coloredCC.svg';
import { ReactComponent as PaypalLogo } from '@shared/assets/paypalLogo.svg';

import { useAppDispatch } from '../redux/hooks';
import { updatePaymentMethodId } from '../redux/slices/newSubmissionSlice';

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
            borderColor: ({ isSelected }: any) => (isSelected ? '#20BFB8' : '#DDDDDD'),
            borderWidth: ({ isSelected }: any) => (isSelected ? '2px' : '1px'),
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
            fontWeight: ({ isSelected }: any) => (isSelected ? 'bold' : 'normal'),
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
    methodId: number;
};

function PaymentMethodItem(props: PaymentMethodItemProps) {
    const classes = useStyles(props);
    const dispatch = useAppDispatch();
    const { isSelected, methodName, methodId } = props;

    function handleOnChange() {
        dispatch(updatePaymentMethodId(methodId));
    }

    return (
        <ButtonBase className={classes.root} onClick={handleOnChange}>
            <div className={classes.leftSide}>
                <div className={classes.radioBtnContainer}>
                    <GreenRadio checked={isSelected} />
                </div>
                {methodId === 1 ? <ColoredCC /> : <PaypalLogo />}
                {methodId === 1 ? (
                    <div className={classes.rightSide}>
                        <Typography variant={'subtitle2'} className={classes.levelTitle}>
                            {methodName}
                        </Typography>
                    </div>
                ) : null}
            </div>
        </ButtonBase>
    );
}

export default PaymentMethodItem;

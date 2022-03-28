import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Radio, { RadioProps } from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import React from 'react';
import { ReactComponent as ColoredCC } from '@shared/assets/coloredCC.svg';
import { ReactComponent as PaypalLogo } from '@shared/assets/paypalLogo.svg';
import { useConfiguration } from '@shared/hooks/useConfiguration';
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
        rightSideColumn: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
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
    const { collectorCoinDiscountPercentage } = useConfiguration();
    function handleOnChange() {
        dispatch(updatePaymentMethodId(methodId));
    }

    return (
        <ButtonBase className={classes.root} onClick={handleOnChange}>
            <div className={classes.leftSide}>
                <div className={classes.radioBtnContainer}>
                    <GreenRadio checked={isSelected} />
                </div>
                {methodId === 1 ? <ColoredCC /> : <div />}
                {methodId === 2 ? <PaypalLogo /> : <div />}
                {methodId === 3 ? (
                    <Avatar src={'https://i.imgur.com/fjRxNJr.png'} sx={{ width: '30px', height: '30px' }} />
                ) : (
                    <div />
                )}

                {methodId === 1 ? (
                    <div className={classes.rightSide}>
                        <Typography variant={'subtitle2'} className={classes.levelTitle}>
                            {methodName}
                        </Typography>
                    </div>
                ) : null}

                {methodId === 3 ? (
                    <div className={classes.rightSideColumn}>
                        <Typography variant={'subtitle2'} className={classes.levelTitle}>
                            {methodName}
                        </Typography>
                        <Typography
                            variant={'subtitle2'}
                            sx={{ fontSize: '14px', color: '#20BFB8', marginLeft: '12px' }}
                        >
                            {`Save ${collectorCoinDiscountPercentage}%`}
                        </Typography>
                    </div>
                ) : null}
            </div>
        </ButtonBase>
    );
}

export default PaymentMethodItem;

import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useMemo } from 'react';
import { getPaymentIcon, getPaymentTitle } from '@shared/lib/payments';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { CreditCard, setSelectedStripeCard } from '@dashboard/redux/slices/newSubmissionSlice';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '100%',
            maxHeight: '76px',
            border: '1px solid #E0E0E0',
            marginBottom: '12px',
            borderRadius: '4px',
            padding: '10px 8px 10px 6px',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
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
            fontWeight: '500',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        protectionText: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'right',
            letterSpacing: '0.1px',
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
        cardMetadataContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginLeft: '12px',
        },
        expDate: {
            fontWeight: 'normal',
            color: 'grey',
        },
    }),
    { name: 'ServiceLevelItemStyle' },
);

function PaymentCardItem(props: CreditCard) {
    const currentSelectedCardId = useAppSelector((state) => state.newSubmission.step04Data.selectedCreditCard.id);

    const styleProps = useMemo(
        () => ({ isSelected: props.id === currentSelectedCardId }),
        [props.id, currentSelectedCardId],
    );
    const classes = useStyles(styleProps);
    const dispatch = useAppDispatch();

    const { expMonth, expYear, last4, brand, id } = props;

    function handleOnChange() {
        dispatch(setSelectedStripeCard(id));
    }

    return (
        <ButtonBase className={classes.root} onClick={handleOnChange}>
            <div className={classes.leftSide}>
                <div className={classes.rightSide}>
                    <Avatar
                        sx={{ width: 56, height: 36, bgcolor: '#F5F5F5' }}
                        variant="square"
                        src={getPaymentIcon(brand)!}
                    />
                    <div className={classes.cardMetadataContainer}>
                        <Typography variant={'subtitle2'} className={classes.levelTitle}>
                            {`${getPaymentTitle(brand)} ending in ${last4}`}
                        </Typography>
                        <Typography variant={'subtitle2'} className={classes.expDate}>
                            {`Expires in ${expMonth}/${expYear}`}
                        </Typography>
                    </div>
                </div>
            </div>
        </ButtonBase>
    );
}

export default PaymentCardItem;

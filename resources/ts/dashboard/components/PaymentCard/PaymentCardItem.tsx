import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import { getPaymentIcon, getPaymentTitle } from '@shared/lib/payments';
import DeletePaymentCardDialog from '@dashboard/components/PaymentCard/DeletePaymentCardDialog';
import { CreditCard } from '@dashboard/redux/slices/newSubmissionSlice';

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
    { name: 'PaymentCardItem' },
);

interface PaymentCardItemProps extends CreditCard {
    handleCardDeleteSubmit(id: any): Promise<void> | void;
}

function PaymentCardItem(props: PaymentCardItemProps) {
    const classes = useStyles();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { handleCardDeleteSubmit, expMonth, expYear, last4, brand, id } = props;

    return (
        <>
            <DeletePaymentCardDialog
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                paymentCardNumber={last4}
                paymentCardBrand={brand}
                paymentCardId={id}
                onSubmit={() => handleCardDeleteSubmit(id)}
            />

            <ButtonBase className={classes.root}>
                <div className={classes.leftSide}>
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

                <div className={classes.rightSide}>
                    <IconButton aria-label="delete" onClick={() => setShowDeleteModal(true)} size="large">
                        <DeleteIcon fontSize="medium" />
                    </IconButton>
                </div>
            </ButtonBase>
        </>
    );
}

export default PaymentCardItem;

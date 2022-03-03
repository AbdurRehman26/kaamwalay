import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { styled } from '@mui/material/styles';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(
    {
        paymentNoteContainer: {
            backgroundColor: '#FCF4EC',
            border: '2px solid #da6612',
            borderRadius: 6,
            padding: 12,
        },
        paymentNoteHeading: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'center',
        },
        payNowButton: {
            padding: '10px 24px 10px 24px',
        },
    },
    { name: 'SubmissionTableRow' },
);

interface PaymentPendingNoticeProps {
    id: number;
    status: string;
    paymentStatus: string;
}

export default function PaymentPendingNotice(props: PaymentPendingNoticeProps) {
    const classes = useStyles();
    const navigate = useNavigate();

    const { id } = props;

    return (
        <div className={classes.paymentNoteContainer}>
            <Typography variant={'h6'} className={classes.paymentNoteHeading}>
                <StyledMoneyIcon />
                Payment Pending
            </Typography>
            <Typography variant={'body2'} mt={1} mb={1}>
                You can now pay whenever you like. Just keep in mind we can't ship your cards back till you have
                completed payment.
            </Typography>
            <Button
                onClick={() => navigate(`${id}/pay`)}
                variant={'contained'}
                color={'primary'}
                className={classes.payNowButton}
            >
                pay now
            </Button>
        </div>
    );
}

const StyledMoneyIcon = styled(MonetizationOnOutlinedIcon)({
    minWidth: 36,
    height: 36,
    color: '#da6612',
    marginRight: 8,
});

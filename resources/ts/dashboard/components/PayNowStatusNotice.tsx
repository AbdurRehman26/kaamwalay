import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRemainingTimeUntilMsTimestamp } from './Counter';

const CardDiv = styled(Card)({
    '.BoldTitle': {
        color: '#DA6612',
    },
});

const styles = {
    payNowButton: {
        marginTop: 1,
        padding: '12px 36px 12px 36px',
    },
    payNowButtonConfirmation: {
        marginTop: 1,
        padding: '12px 36px 12px 36px',
        width: '100%',
    },
    cardTitle: {
        background: '#DA6612',
        color: '#ffffff',
        padding: '15px 15px',
    },
    cardHeader: {
        background: 'rgba(218, 102, 18, 0.08)',
        padding: '15px 15px',
    },
};

interface PayNowProps {
    id: number;
    countdownTimestampMs: number;
    hasConfirmationPage: boolean;
}

export default function PaynowStatusNotice(props: PayNowProps) {
    const navigate = useNavigate();
    const { id, countdownTimestampMs, hasConfirmationPage } = props;

    const defaultRemainingTime = {
        seconds: '00',
        minutes: '00',
        hours: '00',
        days: '00',
    };

    const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateRemainingTime(countdownTimestampMs);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [countdownTimestampMs]);

    function updateRemainingTime(countdown: any) {
        setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
    }

    return (
        <CardDiv sx={{ border: '1px solid rgba(218, 102, 18, 1)' }}>
            {hasConfirmationPage ? (
                <Grid sx={styles.cardTitle}>
                    <Typography sx={{ fontSize: '20px' }}>
                        Pay in the next{' '}
                        <b>
                            {remainingTime.hours}h : {remainingTime.minutes}m : {remainingTime.seconds}s
                        </b>{' '}
                        and get <b>5% back</b> in AGS credit.
                    </Typography>
                </Grid>
            ) : null}
            <CardContent sx={{ background: 'rgba(218, 102, 18, 0.08)' }}>
                {hasConfirmationPage ? (
                    <>
                        <Typography variant="body2">
                            If you choose to pay now you <b>EARN 5%</b> in credit to go towards any future order.
                        </Typography>
                        <Typography variant="body2" mt={3} mb={2}>
                            You can pay whenever you like. Just keep in mind we can't ship your cards back until you
                            have completed payment.
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography sx={{ fontSize: '20px' }}>
                            <b>Payment Pending: </b>Pay in the next{' '}
                            <b className={'BoldTitle'}>
                                {remainingTime.hours}h : {remainingTime.minutes}m : {remainingTime.seconds}s
                            </b>{' '}
                            and get
                            <b className={'BoldTitle'}> 5% back</b> in AGS credit.
                        </Typography>
                        <Typography variant="body2" mt={2} mb={2}>
                            If you choose to pay now you <b>EARN 5%</b> in credit to go towards any future order. You
                            can pay whenever you like. Just keep in mind we can't ship your cards back until you have
                            completed payment.
                        </Typography>
                    </>
                )}
                <Button
                    onClick={() => navigate(`/submissions/${id}/pay`)}
                    variant={'contained'}
                    color={'primary'}
                    sx={hasConfirmationPage ? styles.payNowButtonConfirmation : styles.payNowButton}
                >
                    PAY NOW
                </Button>
            </CardContent>
        </CardDiv>
    );
}

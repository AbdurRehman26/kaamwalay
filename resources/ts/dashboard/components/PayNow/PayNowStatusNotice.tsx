import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRemainingTime } from '@shared/components/Counter';
import PayNowHeading from './PayNowHeading';

const CardDiv = styled(Card)({
    border: '1px solid rgba(218, 102, 18, 1)',

    '.BoldTitle': {
        color: '#DA6612',
    },
    '.PayNowButton': {
        marginTop: 1,
        padding: '12px 36px 12px 36px',
    },
    '.PayNowButtonConfirmation': {
        marginTop: 1,
        padding: '12px 36px 12px 36px',
        width: '100%',
    },
    '.CardTitle': {
        background: '#DA6612',
        color: '#ffffff',
        padding: '15px 15px',
    },
    '.Title': {
        color: '#FFFFFF',
    },
});

const PaperDiv = styled(Paper)({
    border: '1px solid rgba(218, 102, 18, 1)',
    padding: '15px 15px',
    background: 'rgba(218, 102, 18, 0.08)',

    '.BoldTitle': {
        color: '#DA6612',
    },
});

interface PayNowProps {
    id: number;
    countdownTimestampMs: number;
    isConfirmationPage: boolean;
    isPayPage: boolean;
}

export default function PayNowStatusNotice(props: PayNowProps) {
    const navigate = useNavigate();
    const { id, countdownTimestampMs, isConfirmationPage, isPayPage } = props;

    const defaultRemainingTime = {
        seconds: '00',
        minutes: '00',
        hours: '00',
    };

    const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateRemainingTime(countdownTimestampMs);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [countdownTimestampMs]);

    function updateRemainingTime(countdown: any) {
        setRemainingTime(getRemainingTime(countdown));
    }
    if (isPayPage === true) {
        return (
            <PaperDiv>
                <Typography sx={{ fontSize: '12px' }}>
                    <b className={'BoldTitle'}>Earn 5% </b>
                    <b>in the credit by paying in the next</b> {''}
                    <PayNowHeading remainingTime={remainingTime} hasClass={true} />
                </Typography>
            </PaperDiv>
        );
    }

    return (
        <CardDiv>
            {isConfirmationPage ? (
                <Grid className={'CardTitle'}>
                    <Typography sx={{ fontSize: '20px' }}>
                        Pay in the next <PayNowHeading remainingTime={remainingTime} hasClass={false} /> and get{' '}
                        <b>5% back</b> in AGS credit.
                    </Typography>
                </Grid>
            ) : null}
            <CardContent sx={{ background: 'rgba(218, 102, 18, 0.08)' }}>
                {isConfirmationPage ? (
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
                            <PayNowHeading remainingTime={remainingTime} hasClass={true} /> and get
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
                    className={isConfirmationPage ? 'PayNowButtonConfirmation' : 'PayNowButton'}
                >
                    PAY NOW
                </Button>
            </CardContent>
        </CardDiv>
    );
}

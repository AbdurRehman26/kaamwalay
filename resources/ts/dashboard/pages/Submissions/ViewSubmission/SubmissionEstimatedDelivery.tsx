import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface SubmissionEstimatedDeliveryProps {
    serviceLevel: string;
    turnAround: string;
    estimatedDeliveryStartDate: string;
    estimatedDeliveryEndDate: string;
}

export function SubmissionEstimatedDelivery({
    serviceLevel,
    turnAround,
    estimatedDeliveryStartDate,
    estimatedDeliveryEndDate,
}: SubmissionEstimatedDeliveryProps) {
    return (
        <>
            <Grid py={2} alignItems={'flex-start'}>
                <Typography variant={'body1'} fontWeight={500}>
                    Estimated Delivery
                </Typography>
                <Grid container alignItems={'center'}>
                    <Typography variant={'h6'} color={'primary'} fontWeight={500}>
                        {estimatedDeliveryStartDate !== estimatedDeliveryEndDate
                            ? `${estimatedDeliveryStartDate} - ${estimatedDeliveryEndDate}`
                            : estimatedDeliveryStartDate}
                    </Typography>
                </Grid>
                <Grid display={'flex'}>
                    <Typography variant={'caption'} mb={2.5}>
                        Service Level: {serviceLevel} &nbsp;
                    </Typography>
                    <Typography variant={'caption'} sx={{ color: '#0000008A' }}>
                        {`(${turnAround})`}
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
}

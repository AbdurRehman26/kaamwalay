import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { formatDate } from '@shared/lib/datetime/formatDate';

interface SubmissionEstimatedDeliveryProps {
    serviceLevel: string;
    turnAround: string;
    estimatedDeliveryStartAt: Date;
    estimatedDeliveryEndAt: Date;
}

export function SubmissionEstimatedDelivery({
    serviceLevel,
    turnAround,
    estimatedDeliveryStartAt,
    estimatedDeliveryEndAt,
}: SubmissionEstimatedDeliveryProps) {
    const estimatedDeliveryStartDate = formatDate(estimatedDeliveryStartAt, 'MMM DD, YYYY');
    const estimatedDeliveryEndDate = formatDate(estimatedDeliveryEndAt, 'MMM DD, YYYY');

    return (
        <>
            <Grid py={1} alignItems={'flex-start'}>
                <Typography variant={'body1'} fontWeight={500} sx={{ fontSize: '14px' }}>
                    Estimated Shipping
                </Typography>
                <Grid container alignItems={'center'}>
                    <Typography variant={'h6'} color={'primary'} fontWeight={500}>
                        {estimatedDeliveryStartDate !== estimatedDeliveryEndDate
                            ? `${formatDate(estimatedDeliveryStartAt, 'MMM DD ')} - ${estimatedDeliveryEndDate}`
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

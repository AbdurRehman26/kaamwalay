import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { formatDate } from '@shared/lib/datetime/formatDate';

interface SubmissionEstimatedDeliveryProps {
    serviceLevel: string;
    turnAround: string;
    estimatedDeliveryStartAt: string;
    estimatedDeliveryEndAt: string;
}

export function SubmissionEstimatedDelivery({
    serviceLevel,
    turnAround,
    estimatedDeliveryStartAt,
    estimatedDeliveryEndAt,
}: SubmissionEstimatedDeliveryProps) {
    return (
        <>
            <Grid py={1} alignItems={'flex-start'}>
                <Typography variant={'body1'} fontWeight={500} sx={{ fontSize: '14px' }}>
                    Estimated Delivery
                </Typography>
                <Grid container alignItems={'center'}>
                    <Typography variant={'h6'} color={'primary'} fontWeight={500}>
                        {estimatedDeliveryStartAt !== estimatedDeliveryEndAt
                            ? `${formatDate(estimatedDeliveryStartAt, 'MMM DD ')} - ${formatDate(
                                  estimatedDeliveryEndAt,
                                  'MMM DD, YYYY',
                              )}`
                            : formatDate(estimatedDeliveryStartAt, 'MMM DD, YYYY')}
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

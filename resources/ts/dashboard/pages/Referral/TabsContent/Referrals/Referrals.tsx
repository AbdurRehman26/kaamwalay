import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CommissionEarnings from './CommissionEarnings';
import CustomerSignups from './CustomerSignups';

const ReferralDiv = styled(Grid)({
    '.ReferralHeading': {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '10px 0px',
    },
    '.ReferralDescription': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
});

export function Referrals() {
    return (
        <ReferralDiv>
            <Typography className={'ReferralHeading'}>Referrals</Typography>
            <Typography className={'ReferralDescription'}>
                View all commission earnings and customer sign ups as a result of your referrals.{' '}
            </Typography>
            <Grid>
                <CommissionEarnings />
                <CustomerSignups />
            </Grid>
        </ReferralDiv>
    );
}

export default Referrals;

import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import theme from '@shared/styles/theme';
import ReferralDialog from './ReferralDialog';

const ReferralBannerGrid = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',
    background: '#F1FFFE',
    border: '1px solid #20BFB8',
    borderRadius: '4px',
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
        display: 'block',
    },

    '.BannerText': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: '#20BFB8',
    },
    '.LearnMoreDiv': {
        [theme.breakpoints.down('sm')]: {
            marginTop: '10px',
        },
    },
});

export function ReferralBanner() {
    return (
        <>
            <ReferralDialog />
            <ReferralBannerGrid>
                <Grid>
                    <Typography className={'BannerText'}>
                        Earn money by referring your friends & followers to RoboGrading!
                    </Typography>
                </Grid>
                <Grid className={'LearnMoreDiv'}>
                    <MuiLink className={'BannerText'} component={Link} to={`/referral-program/main`}>
                        LEARN MORE
                    </MuiLink>
                </Grid>
            </ReferralBannerGrid>
        </>
    );
}

export default ReferralBanner;

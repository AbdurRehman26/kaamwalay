import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import theme from '@shared/styles/theme';

const DeactivateBanner = styled(Grid)({
    background: '#FFF3F0',
    border: '1px solid #E53B16',
    borderRadius: '4px',
    padding: '20px',
    minWidth: '547px',
    [theme.breakpoints.down('sm')]: {
        minWidth: '100%',
    },
    '.HeadingDiv': {
        display: 'flex',
        alignItems: 'flex-start',
    },
    '.Heading': {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.Icon': {
        color: '#E63B16',
        marginLeft: '10px',
    },
    '.DescriptionDiv': {},
    '.Description': {
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
});

export function ReferralDeactivateBanner() {
    return (
        <DeactivateBanner>
            <Grid className={'HeadingDiv'}>
                <div>
                    <Typography className={'Heading'}>Referral Program Deactivated</Typography>
                </div>
                <div>
                    <ErrorOutlinedIcon className={'Icon'} />
                </div>
            </Grid>
            <Grid className={'DescriptionDiv'}>
                <Typography className={'Description'}>
                    The referral program on your account has been deactivated. Your referral link is no longer active.
                    Referral privileges can be taken away for various reasons including abuse or misuse of the program.
                    If you think this is a mistake, please call us at +1 929-209-3925 or email us at hey@agscard.com.
                </Typography>
            </Grid>
        </DeactivateBanner>
    );
}

export default ReferralDeactivateBanner;

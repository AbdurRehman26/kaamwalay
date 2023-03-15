import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { round } from 'lodash';
import { Link } from 'react-router-dom';
import { ReferrerEntity } from '@shared/entities/ReferrerEntity';
import theme from '@shared/styles/theme';

const WithDrawDiv = styled(Grid)({
    background: '#FFFFFF',
    width: '100%',
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
        marginLeft: '0px',
        marginBottom: '15px',
    },

    '.HeadingDiv': {
        background: '#5022A7',
        padding: '20px',
        borderRadius: '4px 4px 0px 0px',
    },
    '.Heading': {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: '#FFFFFF',
    },
    '.TotalAmount': {
        fontWeight: 800,
        fontSize: '48px',
        lineHeight: '56px',
        color: '#FFFFFF',
        padding: '10px 0px',
    },
    '.StatsBreakDown': {
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid #E0E0E0',
        padding: '20px',
        '&:last-child': {
            borderRadius: '0px 0px 4px 4px',
        },
    },
    '.StatsBreakDownText': {
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.StatsBreakDownPrice': {
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '24px',
        textAlign: 'right',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.WithDrawButton': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.35px',
        color: 'rgba(0, 0, 0, 0.87) !important',
        background: '#42E8E0 !important',
        borderRadius: '24px',
        padding: '15px 20px',
        width: '100%',
        margin: '10px 0px',
        '&:hover': {
            background: '#42E8E0',
        },
    },
    '.ButtonLink': {
        textDecoration: 'none',
    },
});

interface withdrawBoxProps {
    referrer: ReferrerEntity;
}

export function WithdrawBox({ referrer }: withdrawBoxProps) {
    return (
        <WithDrawDiv>
            <Grid className={'HeadingDiv'}>
                <Typography className={'Heading'}>Withdrawable Commission</Typography>
                <Typography className={'TotalAmount'}>
                    ${round(referrer?.withdrawableCommission ?? 0, 2).toFixed(2)}
                </Typography>
                {referrer?.withdrawableCommission > 0 ? (
                    <Link to={'/referral-program/withdraw-funds'} className={'ButtonLink'}>
                        <Button variant="contained" className={'WithDrawButton'}>
                            WITHDRAW FUNDS
                        </Button>
                    </Link>
                ) : null}
            </Grid>
            <Grid>
                <div className={'StatsBreakDown'}>
                    <Typography className={'StatsBreakDownText'}>Link Clicks</Typography>
                    <Typography className={'StatsBreakDownPrice'}>{referrer.linkClicks}</Typography>
                </div>
                <div className={'StatsBreakDown'}>
                    <Typography className={'StatsBreakDownText'}>Successful Sign Ups</Typography>
                    <Typography className={'StatsBreakDownPrice'}>{referrer.successfulSignups}</Typography>
                </div>
                <div className={'StatsBreakDown'}>
                    <Typography className={'StatsBreakDownText'}>Commission Earnings</Typography>
                    <Typography className={'StatsBreakDownPrice'}>{referrer.referralOrders}</Typography>
                </div>
                <div className={'StatsBreakDown'}>
                    <Typography className={'StatsBreakDownText'}>Total Earned</Typography>
                    <Typography className={'StatsBreakDownPrice'}>
                        ${round(referrer.totalEarned, 2).toFixed(2)}
                    </Typography>
                </div>
            </Grid>
        </WithDrawDiv>
    );
}

export default WithdrawBox;

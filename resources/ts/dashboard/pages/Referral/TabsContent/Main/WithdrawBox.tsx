import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { ReferrerEntity } from '@shared/entities/ReferrerEntity';
import theme from '@shared/styles/theme';

const WithDrawDiv = styled(Grid)({
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    width: '100%',
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
        marginLeft: '0px',
        marginBottom: '15px',
    },

    '.HeadingDiv': {
        background: '#5022A7',
        padding: '20px',
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
    },
    '.StatsBreakDown': {
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid #E0E0E0',
        padding: '20px',
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
        color: 'rgba(0, 0, 0, 0.87)',
        background: '#42E8E0',
        borderRadius: '24px',
        padding: '15px 20px',
        width: '100%',
        margin: '10px 0px',
        '&:hover': {
            background: '#42E8E0',
        },
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
                <Typography className={'TotalAmount'}>${referrer?.withdrawableCommission}</Typography>
                {referrer?.withdrawableCommission ? (
                    <Button variant="contained" className={'WithDrawButton'}>
                        WITHDRAW FUNDS
                    </Button>
                ) : null}
            </Grid>
            <Grid>
                <div className={'StatsBreakDown'}>
                    <Typography className={'StatsBreakDownText'}>Link Clicks</Typography>
                    <Typography className={'StatsBreakDownPrice'}>{referrer?.linkClicks}</Typography>
                </div>
                <div className={'StatsBreakDown'}>
                    <Typography className={'StatsBreakDownText'}>Successful Sign Ups</Typography>
                    <Typography className={'StatsBreakDownPrice'}>{referrer?.successfulSignups}</Typography>
                </div>
                <div className={'StatsBreakDown'}>
                    <Typography className={'StatsBreakDownText'}>Commission Earnings</Typography>
                    <Typography className={'StatsBreakDownPrice'}>0</Typography>
                </div>
                <div className={'StatsBreakDown'}>
                    <Typography className={'StatsBreakDownText'}>Total Earned</Typography>
                    <Typography className={'StatsBreakDownPrice'}>$0.00</Typography>
                </div>
            </Grid>
        </WithDrawDiv>
    );
}

export default WithdrawBox;

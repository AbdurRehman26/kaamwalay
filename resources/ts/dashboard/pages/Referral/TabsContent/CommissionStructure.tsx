import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import DummyImage from '@shared/assets/avatar.png';
import Crown from '@shared/assets/crown.png';
import theme from '@shared/styles/theme';

const CommissionStructureBox = styled(Box)({
    '.TopSection': {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '20px',
        maxWidth: '780px',
        [theme.breakpoints.down('sm')]: {
            alignItems: 'baseline',
        },
    },
    '.TopSectionHeading': {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '10px 0px',
    },
    '.TopSectionDescription': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    '.TopSectionDescriptionMobile': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'block',
        },
    },
    '.AvatarDiv': {
        maxWidth: '90px',
        maxHeight: '90px',
        marginRight: '15px',
    },
    '.Avatar': {
        width: '100%',
        height: '100%',
    },
    '.TopSectionHighlightedText': {
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: '#20BFB8',
    },
    '.FaqSection': {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '20px 0px',
    },
    '.FaqQuestion': {
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '5px 0px',
    },
    '.FaqAnswer': {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.FaqSectionDiv': {
        margin: '20px 0px',
    },
    '.Divider': {
        background: '#5022A7',
        width: '47px',
        height: '2px',
        borderRadius: '1px',
    },
    '.QADiv': {
        margin: '15px 0px',
    },
    '.FaqDiv': {
        maxWidth: '550px',
    },
    '.Badge': {
        width: '18px',
        height: '16px',
        marginLeft: '65px',
        marginTop: '-25px',
    },
});

export function CommissionStructure() {
    return (
        <CommissionStructureBox>
            <Grid className={'TopSection'}>
                <Grid className={'AvatarDiv'}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        badgeContent={<img src={Crown} alt={'crown'} className={'Badge'} />}
                    >
                        <Avatar className={'Avatar'} src={DummyImage} />
                    </Badge>
                </Grid>
                <Grid>
                    <Typography className={'TopSectionHeading'}>Your Commission Stucture</Typography>
                    <Typography className={'TopSectionDescription'}>
                        You will earn commission for every paid submission (forever) from people your refer. Commission
                        can be <strong className={'TopSectionHighlightedText'}>$1 per card in submission</strong> or{' '}
                        <strong className={'TopSectionHighlightedText'}>10% of total cost of submission </strong>
                        (whichever is lower).
                    </Typography>
                </Grid>
            </Grid>
            <Grid>
                <Typography className={'TopSectionDescriptionMobile'}>
                    You will earn commission for every paid submission (forever) from people your refer. Commission can
                    be <strong className={'TopSectionHighlightedText'}>$1 per card in submission</strong> or{' '}
                    <strong className={'TopSectionHighlightedText'}>10% of total cost of submission </strong>
                    (whichever is lower).
                </Typography>
            </Grid>
            <Grid className={'FaqSectionDiv'}>
                <Typography className={'FaqSection'}>Frequently Asked Questions</Typography>
                <Divider className={'Divider'} />
            </Grid>
            <Grid className={'FaqDiv'}>
                <div className={'QADiv'}>
                    <Typography className={'FaqQuestion'}>
                        Do I really earn commission on all orders placed by people I refer?{' '}
                    </Typography>
                    <Typography className={'FaqAnswer'}>
                        Yes. Anytime someone you referred orders you will get $1.00 per card in their submission or 10%
                        of cost of their submission total (whichever is lower).
                    </Typography>
                </div>
                <div className={'QADiv'}>
                    <Typography className={'FaqQuestion'}>Can I withdraw my commission at any time?</Typography>
                    <Typography className={'FaqAnswer'}>Yes. You can initiate a withdrawal at any time.</Typography>
                </div>
                <div className={'QADiv'}>
                    <Typography className={'FaqQuestion'}>
                        How long does it take to receive my commission once I initiate a withdrawal?
                    </Typography>
                    <Typography className={'FaqAnswer'}>
                        It may take between 5-7 days for your withdrawal to process and show up on your PayPal account,
                        although it usually takes less time.
                    </Typography>
                </div>
            </Grid>
        </CommissionStructureBox>
    );
}

export default CommissionStructure;
